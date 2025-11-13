/**
 * 표준 사용자 모델 페이지 메타데이터
 */
export const metadata = {
  title: "모델 | AstraGo",
  description: "AI 모델을 관리하고 배포하세요.",
};

/**
 * 표준 사용자 모델 페이지
 *
 * App Router에서 서버 컴포넌트로 구현된 표준 사용자 모델 페이지입니다.
 * 기존 Pages Router와 동일하게 null을 반환합니다.
 *
 * 참고: 인증 및 권한 체크는 middleware.ts에서 처리됨
 * TODO: 향후 모델 기능 구현 예정
 */
export default async function StandardModelPage() {
  // 기존 Pages Router와 동일하게 null 반환
  // 모델 기능은 향후 구현 예정
  return null;
}
