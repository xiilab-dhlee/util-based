import type { ReadonlyURLSearchParams } from "next/navigation";

// Indirect router type to avoid deep importing Next internals
type RouterType = ReturnType<typeof import("next/navigation").useRouter>;

/**
 * useNavigation 훅의 반환 타입 정의
 */
export interface NavigationHook {
  // 기본 App Router 훅들
  router: RouterType;
  pathname: string | null;
  searchParams: ReadonlyURLSearchParams | null;

  // Pages Router와 호환성을 위한 속성들
  asPath: string;
  query: Record<string, string>;

  // 내비게이션 함수들
  push: (href: string, options?: { scroll?: boolean }) => void;
  replace: (href: string, options?: { scroll?: boolean }) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;

  // 유틸리티 함수들
  navigateWithQuery: (
    path: string,
    queryParams?: Record<string, string>,
    replace?: boolean,
  ) => void;
  updateQuery: (
    updates: Record<string, string | null>,
    replace?: boolean,
  ) => void;
  isActiveRoute: (pattern: string) => boolean;
  goBack: (levels?: number) => void;

  // 경로 정보
  pathSegments: string[];
}

/**
 * 쿼리 매개변수 타입
 */
export type QueryParams = Record<string, string>;

/**
 * 내비게이션 옵션 타입
 */
export interface NavigationOptions {
  scroll?: boolean;
  replace?: boolean;
}
