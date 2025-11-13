import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { useState } from "react";

// variables(V)를 받아 데이터를(T) 반환하는 비동기 함수 시그니처
type AsyncFn<V, T> = (variables: V) => Promise<T>;

/**
 * useLazyQuery 옵션 타입
 */
export interface UseLazyQueryOptions<V = void, T = unknown> {
  /** 쿼리 실행 함수 */
  queryFn: AsyncFn<V, T>;
  /** API 요청 전 지연 시간 (밀리초, 기본값: 0) */
  delay?: number;
  /** 추가 옵션 */
  options?: UseMutationOptions<T, unknown, V>;
}

/**
 * 지연 실행 쿼리 훅
 * useMutation과 동일한 방식으로 사용하되, queryFn을 사용합니다.
 *
 * @param config - queryFn과 options를 포함한 설정 객체
 * @returns 쿼리 실행 함수와 상태
 */
export function useLazyQuery<V = void, T = unknown>(
  config: UseLazyQueryOptions<V, T>,
) {
  const { queryFn, delay = 0, options } = config;
  const [isDelaying, setIsDelaying] = useState(false);

  const mutation = useMutation<T, unknown, V>({
    mutationFn: async (variables: V) => {
      // 지연 시간이 설정된 경우 대기
      if (delay > 0) {
        setIsDelaying(true);
        await new Promise((resolve) => setTimeout(resolve, delay));
        setIsDelaying(false);
      }

      // 실제 쿼리 함수 실행
      return queryFn(variables);
    },
    // mutation은 query 캐시를 만들지 않습니다. (필요 시 retry 등 옵션만 조절)
    ...options,
  });

  return {
    // 실행 시점에 payload(variables)를 전달
    execute: mutation.mutateAsync, // (vars: V) => Promise<T>
    data: mutation.data,
    error: mutation.error,
    isLoading: mutation.isPending || isDelaying, // 지연 중이거나 mutation 실행 중일 때 true
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
    status: mutation.status,
  };
}
