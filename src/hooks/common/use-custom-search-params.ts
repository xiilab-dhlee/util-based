// src/hooks/common/use-custom-search-params.ts
"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * 클라이언트 사이드에서만 안전하게 쿼리 스트링을 다루는 커스텀 훅
 *
 * 이 훅은 useSearchParams()의 Suspense 문제를 해결하기 위해 구현되었습니다.
 * 클라이언트 사이드에서만 실행되며, 서버 사이드 렌더링 시에는 안전한 기본값을 반환합니다.
 *
 * @returns 쿼리 파라미터 관련 유틸리티 함수들과 현재 상태
 */
export function useCustomSearchParams() {
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(
    null,
  );
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      setSearchParams(url.searchParams);
    }
  }, []);

  /**
   * 특정 쿼리 파라미터 값을 가져옵니다
   * @param key - 가져올 쿼리 파라미터의 키
   * @returns 쿼리 파라미터 값 또는 null
   */
  const get = useCallback(
    (key: string): string | null => {
      if (!isClient || !searchParams) {
        return null;
      }
      return searchParams.get(key);
    },
    [isClient, searchParams],
  );

  /**
   * 모든 쿼리 파라미터를 객체 형태로 반환합니다
   * @returns 쿼리 파라미터 객체
   */
  const getAll = useCallback((): Record<string, string> => {
    if (!isClient || !searchParams) {
      return {};
    }

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }, [isClient, searchParams]);

  /**
   * 특정 쿼리 파라미터가 존재하는지 확인합니다
   * @param key - 확인할 쿼리 파라미터의 키
   * @returns 존재 여부
   */
  const has = useCallback(
    (key: string): boolean => {
      if (!isClient || !searchParams) {
        return false;
      }
      return searchParams.has(key);
    },
    [isClient, searchParams],
  );

  /**
   * 쿼리 파라미터를 업데이트합니다
   * @param key - 업데이트할 쿼리 파라미터의 키
   * @param value - 새로운 값 (null이면 삭제)
   */
  const set = useCallback(
    (key: string, value: string | null) => {
      if (!isClient || typeof window === "undefined") {
        return;
      }

      const url = new URL(window.location.href);

      if (value === null) {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, value);
      }

      // URL 업데이트 (페이지 새로고침 없이)
      window.history.replaceState({}, "", url.toString());

      // 상태 업데이트
      setSearchParams(url.searchParams);
    },
    [isClient],
  );

  /**
   * 여러 쿼리 파라미터를 한 번에 업데이트합니다
   * @param params - 업데이트할 쿼리 파라미터 객체
   */
  const setMultiple = useCallback(
    (params: Record<string, string | null>) => {
      if (!isClient || typeof window === "undefined") {
        return;
      }

      const url = new URL(window.location.href);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value);
        }
      });

      // URL 업데이트
      window.history.replaceState({}, "", url.toString());

      // 상태 업데이트
      setSearchParams(url.searchParams);
    },
    [isClient],
  );

  /**
   * 모든 쿼리 파라미터를 제거합니다
   */
  const clear = useCallback(() => {
    if (!isClient || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);
    url.search = "";

    // URL 업데이트
    window.history.replaceState({}, "", url.toString());

    // 상태 업데이트
    setSearchParams(new URLSearchParams());
  }, [isClient]);

  /**
   * 현재 쿼리 스트링을 반환합니다
   * @returns 쿼리 스트링 (예: "?key1=value1&key2=value2")
   */
  const toString = useCallback((): string => {
    if (!isClient || !searchParams) {
      return "";
    }
    return searchParams.toString();
  }, [isClient, searchParams]);

  return {
    // 상태
    searchParams,
    isClient,

    // 유틸리티 함수들
    get,
    getAll,
    has,
    set,
    setMultiple,
    clear,
    toString,
  };
}

/**
 * useCustomSearchParams의 타입 정의
 */
export type UseCustomSearchParamsReturn = ReturnType<
  typeof useCustomSearchParams
>;
