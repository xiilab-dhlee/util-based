import type { Page, Route } from "@playwright/test";
import { isFunction, isNil, isString } from "es-toolkit";
import type { HttpHandler } from "msw";

type HandlerInfo = {
  method: string;
  path: string;
  handler: HttpHandler;
};

export type SetupMswHandlersOptions = {
  patterns?: string[];
  delay?: number;
};

/** MSW 핸들러에서 method와 path 정보 추출 */
function extractHandlerInfo(handler: HttpHandler): HandlerInfo | null {
  const { info } = handler;
  if (isNil(info) || !isString(info.path) || !isString(info.method)) {
    return null;
  }
  return { method: info.method.toUpperCase(), path: info.path, handler };
}

/** URL 경로가 MSW 패턴과 매칭되는지 확인 */
function matchPath(
  pattern: string,
  pathname: string,
): { matched: boolean; params: Record<string, string> } {
  const normalizedPattern = pattern.startsWith("*")
    ? pattern.slice(1)
    : pattern;
  const patternParts = normalizedPattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart?.startsWith(":")) {
      params[patternPart.slice(1)] = pathPart ?? "";
    } else if (patternPart !== pathPart) {
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}

/** 요청에 매칭되는 핸들러 찾기 */
function findMatchingHandler(
  handlers: HandlerInfo[],
  method: string,
  pathname: string,
): { handler: HandlerInfo; params: Record<string, string> } | null {
  for (const handlerInfo of handlers) {
    if (handlerInfo.method !== method) continue;

    const result = matchPath(handlerInfo.path, pathname);
    if (result.matched) {
      return { handler: handlerInfo, params: result.params };
    }
  }
  return null;
}

/** MSW 핸들러의 resolver 실행 */
async function executeHandler(
  handler: HttpHandler,
  request: Request,
  params: Record<string, string>,
): Promise<Response | null> {
  try {
    type HandlerWithResolver = { resolver?: (info: unknown) => unknown };
    const resolver = (handler as unknown as HandlerWithResolver).resolver;
    if (!isFunction(resolver)) return null;

    const response = await resolver({ request, params, cookies: {} });
    return response instanceof Response ? response : null;
  } catch (error) {
    console.warn("[MSW Converter] Handler execution error:", error);
    return null;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Playwright Request에서 body 추출 */
function extractRequestBody(
  request: ReturnType<Route["request"]>,
): BodyInit | null {
  const method = request.method();
  const supportsBody = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
  if (!supportsBody) return null;

  const postData = request.postData();
  if (postData !== null) return postData;

  const buffer = request.postDataBuffer();
  return buffer !== null ? new Uint8Array(buffer) : null;
}

/** Response를 Playwright fulfill 형식으로 변환 */
async function responseToFulfill(response: Response) {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const contentType = response.headers.get("content-type");
  const isText =
    !contentType ||
    contentType.startsWith("text/") ||
    contentType.includes("json") ||
    contentType.includes("javascript") ||
    contentType.includes("xml");

  if (isText) {
    return { status: response.status, headers, body: await response.text() };
  }

  const arrayBuffer = await response.arrayBuffer();
  return { status: response.status, headers, body: Buffer.from(arrayBuffer) };
}

/** API 요청을 처리하는 라우트 핸들러 생성 */
function createRouteHandler(handlerInfos: HandlerInfo[], delayMs = 0) {
  return async (route: Route) => {
    try {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();

      const match = findMatchingHandler(handlerInfos, method, url.pathname);
      if (!match) return route.continue();

      if (delayMs > 0) await delay(delayMs);

      const body = extractRequestBody(request);
      const headers = new Headers(request.headers());

      if (body && !headers.get("content-type")) {
        headers.set(
          "content-type",
          isString(body) ? "text/plain" : "application/octet-stream",
        );
      }

      const mswRequest = new Request(request.url(), {
        method: method,
        headers,
        body,
      });

      const response = await executeHandler(
        match.handler.handler,
        mswRequest,
        match.params,
      );

      if (response) {
        return route.fulfill(await responseToFulfill(response));
      }

      return route.continue();
    } catch (error) {
      const request = route.request();
      console.warn(
        `[MSW Converter] Error: ${request.method()} ${new URL(request.url()).pathname}`,
        error,
      );
      return route.continue();
    }
  };
}

/** MSW 핸들러 배열을 Playwright Route로 설정 */
export async function setupMswHandlers(
  page: Page,
  handlers: HttpHandler[],
  options: SetupMswHandlersOptions = {},
): Promise<void> {
  const {
    patterns = ["**/core-api/**", "**/monitor-api/**", "**/api/**"],
    delay: delayMs = 0,
  } = options;

  const handlerInfos = handlers
    .map(extractHandlerInfo)
    .filter((info): info is HandlerInfo => info !== null);

  const routeHandler = createRouteHandler(handlerInfos, delayMs);

  for (const pattern of patterns) {
    await page.route(pattern, routeHandler);
  }
}

/** 모든 모킹 해제 */
export async function removeAllMswHandlers(page: Page): Promise<void> {
  await page.unrouteAll();
}
