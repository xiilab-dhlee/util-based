"use client";

import { setupWorker } from "msw/browser";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

import { combinedHandlers } from "@/handlers";

/**
 * MSW Provider
 * 개발 환경에서 API mocking을 위한 MSW 초기화
 */
export function MSWProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(
    // 개발 환경이 아니면 즉시 준비 상태로 설정
    process.env.NODE_ENV !== "development",
  );

  useEffect(() => {
    // MSW는 개발 환경에서만 활성화
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // 동적으로 MSW worker를 import하고 시작
    const initMSW = async () => {
      try {
        const worker = setupWorker(...combinedHandlers);

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

        setIsReady(true);
      } catch (error) {
        console.error("[MSW] Service Worker 시작 실패:", error);
        console.warn("[MSW] 실제 API를 호출합니다.");
        setIsReady(true); // 실패해도 앱은 계속 동작
      }
    };

    initMSW();
  }, []);

  // MSW가 준비될 때까지 children을 렌더링하지 않음
  // 이렇게 하면 MSW가 먼저 초기화되어 초기 요청도 모킹 가능
  if (!isReady) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "system-ui, sans-serif",
          color: "#666",
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
          <div>MSW 초기화 중...</div>
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
