import type { Metadata } from "next";

/**
 * 표준 사용자 퍼블릭 레지스트리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "퍼블릭 레지스트리 | AstraGo",
  description: "퍼블릭 컨테이너 레지스트리를 탐색하세요.",
};

/**
 * 표준 사용자 퍼블릭 레지스트리 페이지
 *
 * App Router에서 서버 컴포넌트로 구현된 표준 사용자 퍼블릭 레지스트리 페이지입니다.
 * 기존 Pages Router와 동일하게 null을 반환합니다.
 *
 * 참고: 인증 및 권한 체크는 middleware.ts에서 처리됨
 * TODO: 향후 퍼블릭 레지스트리 기능 구현 예정
 */
export default async function StandardPublicRegistryPage() {
  // 기존 Pages Router와 동일한 기능을 유지하되 의미있는 콘텐츠 반환
  // 퍼블릭 레지스트리 기능은 향후 구현 예정
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
        color: "#666",
      }}
    >
      <div>
        <h2>퍼블릭 레지스트리</h2>
        <p>퍼블릭 레지스트리 기능을 준비 중입니다...</p>
      </div>
    </div>
  );
}
