import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import {
  getErrorMessage,
  logErrorInfo,
  shouldShowToast,
} from "@/utils/error/error-utils";

interface QueryProviderProps {
  children: ReactNode;
}

// QueryClient 생성 함수
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 3 * 60 * 1000, // 3분
        gcTime: 5 * 60 * 1000, // 5분 (구 cacheTime)
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: (error, query) => {
        // 🎯 전역 쿼리 에러 처리
        const { queryKey } = query;

        // 개발 모드에서 디버깅 정보 출력
        logErrorInfo(queryKey, error);

        // 메타 정보 또는 설정 기반 토스트 표시 여부 결정
        const showToastFromMeta = query.meta?.showToastOnError;
        const showToastFromConfig = shouldShowToast(queryKey);

        // 메타 정보가 있으면 우선, 없으면 설정 사용
        const showToast =
          showToastFromMeta !== undefined
            ? showToastFromMeta
            : showToastFromConfig;

        if (showToast) {
          const errorMessage = getErrorMessage(queryKey, error);
          toast.error(errorMessage);
        }
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        // 🎯 전역 뮤테이션 에러 처리
        const queryKey = mutation.options.mutationKey || ["unknown"];

        // 개발 모드에서 디버깅 정보 출력
        logErrorInfo(queryKey, error);

        // 뮤테이션은 기본적으로 토스트 표시
        const showToast = mutation.meta?.showToastOnError !== false;

        if (showToast) {
          const errorMessage = getErrorMessage(queryKey, error);
          toast.error(errorMessage);
        }
      },
      onSuccess: (data, variables, context, mutation) => {
        // 🎯 뮤테이션 성공 시 토스트 (옵션)
        const successMessage = mutation.meta?.successMessage;
        if (successMessage) {
          // 런타임 타입 가드를 사용한 안전한 문자열 처리
          if (typeof successMessage === "string") {
            toast.success(successMessage);
          } else {
            // 문자열이 아닌 경우 안전하게 변환
            toast.success(String(successMessage));
          }
        }
      },
    }),
  });
};

export function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient를 상태로 관리하여 리렌더링 시 재생성 방지
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 모드에서만 DevTools 표시 */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
