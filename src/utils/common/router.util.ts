/**
 * 현재 관리자 모드인지 확인하는 함수
 * @param pathname - 현재 경로명
 * @returns 관리자 모드 여부
 */
export function isAdminMode(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * 현재 사용자 모드인지 확인하는 함수
 * @param pathname - 현재 경로명
 * @returns 사용자 모드 여부
 */
export function isUserMode(pathname: string): boolean {
  return pathname.startsWith("/standard");
}

/**
 * 뒤로가기 버튼 클릭 시 목록 페이지로 이동하는 함수
 * @param pathname - 현재 경로명
 * @returns 상위 경로명
 */
export function getBackPathname(pathname: string): string {
  // 마지막 / 이후의 문자열을 제거하여 상위 경로로 이동
  const lastSlashIndex = pathname.lastIndexOf("/");
  return lastSlashIndex > 0 ? pathname.substring(0, lastSlashIndex) : pathname;
}
