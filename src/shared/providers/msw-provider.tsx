"use client";

import { isNil } from "es-toolkit";
import type { RequestHandler } from "msw";
import { setupWorker } from "msw/browser";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

/**
 * MSW Provider
 * 개발 환경에서 API mocking을 위한 MSW 초기화
 *
 * 동작 조건:
 * - MSW_ENABLE 환경변수가 "true"일 때만 활성화
 *
 * 빌드 타임에 환경 변수가 결정되므로 서버/클라이언트 모두 동일한 값을 가짐
 * - pnpm dev:mock (MSW_ENABLE=true): 로딩 화면 표시 후 MSW 초기화
 * - pnpm start (MSW_ENABLE=undefined): 바로 children 렌더링
 */

// 빌드 타임에 결정되는 값 (서버/클라이언트 동일)
const isMswEnabled = process.env.MSW_ENABLE === "true";

type HandlerCandidate = unknown;

function isRequestHandler(
  handler: HandlerCandidate,
): handler is RequestHandler {
  return (
    typeof handler === "object" &&
    !isNil(handler) &&
    ("info" in handler || "resolver" in handler)
  );
}

export function MSWProvider({ children }: PropsWithChildren) {
  // MSW 비활성화 시 바로 준비 상태 (로딩 화면 없음)
  const [isReady, setIsReady] = useState(!isMswEnabled);

  useEffect(() => {
    // MSW가 비활성화되어 있으면 아무것도 하지 않음
    if (!isMswEnabled) {
      return;
    }

    // 동적으로 MSW worker를 import하고 시작
    const initMSW = async () => {
      try {
        // 동적으로 handlers를 import (클라이언트에서 환경변수 문제 해결)
        const { combinedHandlers } = await import("@/mocks/handlers");

        const invalidHandlers = combinedHandlers.filter(
          (handler) => !isRequestHandler(handler),
        );
        if (invalidHandlers.length > 0) {
          console.warn(
            "[MSW] 유효하지 않은 핸들러가 포함되어 있습니다:",
            invalidHandlers,
          );
        }

        const validHandlers = combinedHandlers.filter(isRequestHandler);

        const worker = setupWorker(...validHandlers);

        // Service Worker가 완전히 활성화될 때까지 대기
        await worker.start({
          onUnhandledRequest: "bypass", // 모킹되지 않은 요청은 실제 서버로 전달
          quiet: false, // 콘솔에 MSW 로그 표시
          serviceWorker: {
            url: "/mockServiceWorker.js", // Service Worker 파일 경로 명시
          },
        });

        console.log("[MSW] Service Worker가 준비되었습니다.");

        // Service Worker 활성화 후 추가 대기 시간
        // 이렇게 하면 Service Worker가 완전히 등록되고 요청을 가로챌 준비가 됨
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error("[MSW] Service Worker 시작 실패:", error);
        console.warn("[MSW] 실제 API를 호출합니다.");
      } finally {
        setIsReady(true);
      }
    };

    initMSW();
  }, []);

  // MSW 활성화 상태에서 아직 준비되지 않았으면 로딩 화면 표시
  if (!isReady) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <div>Mocking Service Worker 구동 중...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
