/**
 * 표준 사용자 모니터링 대시보드 페이지 메타데이터
 */
export const metadata = {
  title: "모니터링 대시보드 | AstraGo",
  description: "시스템 모니터링 및 성능 대시보드",
};

/**
 * 표준 사용자 모니터링 대시보드 페이지
 *
 * App Router에서 서버 컴포넌트로 구현된 모니터링 대시보드 페이지입니다.
 * 현재는 표준 사용자용 모니터링 기능이 구현되지 않아 null을 반환합니다.
 *
 * 참고: 인증 및 권한 체크는 middleware.ts에서 처리됨
 * TODO: 향후 표준 사용자용 모니터링 대시보드 기능 구현 예정
 */
export default async function StandardMonitoringPage() {
  // 현재는 표준 사용자용 모니터링 기능이 없어 null 반환
  // 향후 표준 사용자용 모니터링 대시보드 기능 구현 예정
  return null;
}
