"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { NavigationHook, QueryParams } from "./types";

/**
 * App Router 아키텍처를 위한 내비게이션 유틸리티 훅
 * Pages Router에서 App Router로의 마이그레이션을 쉽게 하기 위한 일관된 API 제공
 *
 * @returns 내비게이션 관련 유틸리티 함수들과 현재 상태
 */
export function useNavigation(): NavigationHook {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * 현재 쿼리 매개변수를 객체 형태로 반환 (Pages Router와 유사한 방식)
   */
  const query = useMemo<QueryParams>(() => {
    const queryObject: QueryParams = {};

    if (searchParams) {
      searchParams.forEach((value, key) => {
        queryObject[key] = value;
      });
    }

    return queryObject;
  }, [searchParams]);

  /**
   * 현재 경로 정보 (asPath와 유사한 역할)
   * 쿼리 매개변수가 포함된 전체 경로
   */
  const asPath = useMemo(() => {
    const currentPath = pathname || "/";
    if (!searchParams || searchParams.toString() === "") {
      return currentPath;
    }
    return `${currentPath}?${searchParams.toString()}`;
  }, [pathname, searchParams]);

  /**
   * 쿼리 매개변수와 함께 페이지로 내비게이션하는 함수
   * @param path - 이동할 경로
   * @param queryParams - 쿼리 매개변수 객체
   * @param replace - replace 모드로 내비게이션할지 여부 (기본값: false)
   */
  const navigateWithQuery = useCallback(
    (path: string, queryParams: QueryParams = {}, replace = false) => {
      // URLSearchParams를 사용하여 쿼리 문자열 생성
      const searchParams = new URLSearchParams();

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.set(key, value);
        }
      });

      const queryString = searchParams.toString();
      const fullPath = queryString ? `${path}?${queryString}` : path;

      if (replace) {
        router.replace(fullPath);
      } else {
        router.push(fullPath);
      }
    },
    [router],
  );

  /**
   * 현재 경로에서 특정 쿼리 매개변수만 업데이트하는 함수
   * @param updates - 업데이트할 쿼리 매개변수 객체
   * @param replace - replace 모드로 내비게이션할지 여부 (기본값: false)
   */
  const updateQuery = useCallback(
    (updates: Record<string, string | null>, replace = false) => {
      const newQuery = { ...query };

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          delete newQuery[key];
        } else {
          newQuery[key] = value;
        }
      });

      navigateWithQuery(pathname || "/", newQuery, replace);
    },
    [query, pathname, navigateWithQuery],
  );

  /**
   * 현재 경로가 특정 패턴과 일치하는지 확인하는 함수
   * @param pattern - 확인할 패턴 (예: '/admin', '/standard/workload')
   * @returns 패턴 일치 여부
   */
  const isActiveRoute = useCallback(
    (pattern: string) => {
      return (pathname || "/").startsWith(pattern);
    },
    [pathname],
  );

  /**
   * 경로 세그먼트를 배열로 반환하는 함수
   * @returns 경로 세그먼트 배열
   */
  const pathSegments = useMemo(() => {
    return (pathname || "/").split("/").filter(Boolean);
  }, [pathname]);

  /**
   * 뒤로가기 함수 (레벨 지정 가능)
   * @param levels - 뒤로 갈 레벨 수 (기본값: 1)
   */
  const goBack = useCallback(
    (levels = 1) => {
      if (levels === 1) {
        router.back();
      } else {
        // 특정 레벨만큼 뒤로 가기
        const segments = pathSegments;
        if (segments.length >= levels) {
          const targetPath = "/" + segments.slice(0, -levels).join("/");
          router.push(targetPath);
        } else {
          router.push("/");
        }
      }
    },
    [router, pathSegments],
  );

  return {
    // 기본 App Router 훅들
    router,
    pathname,
    searchParams,

    // Pages Router와 호환성을 위한 속성들
    asPath,
    query,

    // 내비게이션 함수들
    push: router.push,
    replace: router.replace,
    back: router.back,
    forward: router.forward,
    refresh: router.refresh,

    // 유틸리티 함수들
    navigateWithQuery,
    updateQuery,
    isActiveRoute,
    goBack,

    // 경로 정보
    pathSegments,
  };
}
