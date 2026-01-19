import { isString } from "es-toolkit/predicate";

import { PAGE_META, type PageKey } from "@/shared/constants/page-meta.constant";
import { MODE } from "@/shared/constants/routes.constant";

/**
 * 현재 관리자 모드인지 확인하는 함수
 * @param pathname - 현재 경로명
 * @returns 관리자 모드 여부
 */
export function isAdminMode(pathname: string): boolean {
  return pathname.startsWith(MODE.ADMIN);
}

/**
 * 현재 사용자 모드인지 확인하는 함수
 * @param pathname - 현재 경로명
 * @returns 사용자 모드 여부
 */
export function isUserMode(pathname: string): boolean {
  return pathname.startsWith(MODE.USER);
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

/**
 * 동적 경로의 기본 경로 추출
 * @example /user/workload/abc123/monitoring → /user/workload
 * @param pathname - 현재 경로명
 * @returns mode 다음 첫 번째 세그먼트까지의 경로
 */
export function getDynamicRouteBasePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const basePath = segments.slice(0, 2).join("/");
  return `/${basePath}`;
}

/**
 * 문자열이 유효한 PageKey인지 확인하는 타입 가드
 */
function isPageKey(key: string): key is PageKey {
  return key in PAGE_META;
}

/**
 * 현재 경로에 매칭되는 PAGE_META의 pageKey를 찾는 함수
 * @param pathname - 현재 경로명
 * @returns 매칭된 pageKey 또는 null
 */
function findPageKeyByPathname(pathname: string): PageKey | null {
  return (
    Object.keys(PAGE_META).find((key): key is PageKey => {
      if (!isPageKey(key)) return false;
      const meta = PAGE_META[key];
      // 정적 href만 매칭 (동적 경로는 useParams로 처리)
      return isString(meta.href) && meta.href === pathname;
    }) ?? null
  );
}

/**
 * 워크스페이스 전환 시 부모 페이지로 이동 (없으면 현재 위치 유지)
 */
export function getWorkspaceSwitchRoute(currentPath: string): string {
  if (!isUserMode(currentPath) && !isAdminMode(currentPath)) {
    return "/";
  }

  const pageKey = findPageKeyByPathname(currentPath);
  if (!pageKey) return currentPath;

  const pageMeta = PAGE_META[pageKey];
  if (!("parent" in pageMeta)) return currentPath;

  const parentHref = PAGE_META[pageMeta.parent].href;
  return isString(parentHref) ? parentHref : currentPath;
}
