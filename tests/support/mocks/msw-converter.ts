import type { Page, Route } from "@playwright/test";
import type { HttpHandler } from "msw";

/**
 * MSW 핸들러를 Playwright Route로 변환하는 컨버터
 *
 * MSW의 http.get/post/... 핸들러를 Playwright의 page.route()로 변환하여
 * E2E 테스트에서 동일한 모킹 데이터를 사용할 수 있도록 합니다.
 */

type HandlerInfo = {
  method: string;
  path: string;
  handler: HttpHandler;
};

/**
 * MSW 핸들러에서 method와 path 정보 추출
 */
function extractHandlerInfo(handler: HttpHandler): HandlerInfo | null {
  const info = handler.info;
  if (
    !info ||
    typeof info.path !== "string" ||
    typeof info.method !== "string"
  ) {
    return null;
  }
  return {
    method: info.method.toUpperCase(),
    path: info.path,
    handler,
  };
}

/**
 * URL 경로가 MSW 패턴과 매칭되는지 확인
 *
 * MSW 패턴: /core-api/v1/core/workload/:id
 * URL: /core-api/v1/core/workload/123
 */
function matchPath(
  pattern: string,
  pathname: string,
): { matched: boolean; params: Record<string, string> } {
  const patternParts = pattern.split("/");
  const pathParts = pathname.split("/");

  if (patternParts.length !== pathParts.length) {
    return { matched: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart?.startsWith(":")) {
      // 동적 파라미터
      params[patternPart.slice(1)] = pathPart ?? "";
    } else if (patternPart !== pathPart) {
      // 정적 부분이 일치하지 않음
      return { matched: false, params: {} };
    }
  }

  return { matched: true, params };
}

/**
 * 요청에 매칭되는 핸들러 찾기
 */
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

/**
 * MSW 핸들러의 resolver 실행
 */
async function executeHandler(
  handler: HttpHandler,
  request: Request,
  params: Record<string, string>,
): Promise<Response | null> {
  try {
    // MSW 핸들러의 resolver에 접근 (내부 구조 사용)
    type HandlerWithResolver = { resolver?: (info: unknown) => unknown };
    const resolver = (handler as unknown as HandlerWithResolver).resolver;
    if (typeof resolver !== "function") {
      return null;
    }

    const response = await resolver({
      request,
      params,
      cookies: {},
    });

    if (response instanceof Response) {
      return response;
    }
    return null;
  } catch (error) {
    console.warn("[MSW Converter] Handler execution error:", error);
    return null;
  }
}

/**
 * API 요청을 처리하는 라우트 핸들러 생성
 */
function createRouteHandler(handlerInfos: HandlerInfo[]) {
  return async (route: Route) => {
    try {
      const request = route.request();
      const url = new URL(request.url());
      const method = request.method();
      const pathname = url.pathname;

      // 매칭되는 핸들러 찾기
      const match = findMatchingHandler(handlerInfos, method, pathname);

      if (match) {
        // MSW Request 생성
        const mswRequest = new Request(request.url(), {
          method: request.method(),
          headers: request.headers(),
        });

        // 핸들러 실행
        const response = await executeHandler(
          match.handler.handler,
          mswRequest,
          match.params,
        );

        if (response) {
          const body = await response.text();
          return route.fulfill({
            status: response.status,
            contentType:
              response.headers.get("content-type") ?? "application/json",
            body,
          });
        }
      }

      // 매칭되는 핸들러가 없으면 실제 요청으로 전달
      return route.continue();
    } catch (error) {
      console.warn("[MSW Converter] Error:", error);
      return route.continue();
    }
  };
}

/**
 * MSW 핸들러 배열을 Playwright Route로 설정
 */
export async function setupMswHandlers(
  page: Page,
  handlers: HttpHandler[],
): Promise<void> {
  // 핸들러 정보 추출
  const handlerInfos = handlers
    .map(extractHandlerInfo)
    .filter((info): info is HandlerInfo => info !== null);

  const routeHandler = createRouteHandler(handlerInfos);

  // API 요청 패턴들을 가로채서 MSW로 처리
  await page.route("**/core-api/**", routeHandler);
  await page.route("**/monitor-api/**", routeHandler);
}

/**
 * 모든 모킹 해제
 */
export async function removeAllMswHandlers(page: Page): Promise<void> {
  await page.unrouteAll();
}
