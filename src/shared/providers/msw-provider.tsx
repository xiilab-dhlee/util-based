"use client";

import { setupWorker } from "msw/browser";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

import { combinedHandlers } from "@/handlers";

/**
 * MSW Provider
 * 개발 환경에서 API mocking을 위한 MSW 초기화
 *
 * 동작 조건:
 * - MSW_ENABLE 환경변수가 "true"일 때만 활성화
 */
export function MSWProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(process.env.MSW_ENABLE !== "true");

  useEffect(() => {
    // MSW가 비활성화되어 있으면 즉시 준비 상태로 설정
    if (process.env.MSW_ENABLE !== "true") {
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
      } catch (error) {
        console.error("[MSW] Service Worker 시작 실패:", error);
        console.warn("[MSW] 실제 API를 호출합니다.");
      } finally {
        setIsReady(true);
      }
    };

    initMSW();
  }, []);

  // MSW가 활성화되어 있고 아직 준비되지 않았으면 로딩 화면 표시
  if (process.env.MSW_ENABLE === "true" && !isReady) {
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
