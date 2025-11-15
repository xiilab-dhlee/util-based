import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AxiosError } from "axios";
import { type PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";

import {
  getErrorMessage,
  logErrorInfo,
  shouldShowToast,
} from "@/utils/error/error-utils";

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            staleTime: 3 * 60 * 1000, // 3분
            gcTime: 5 * 60 * 1000, // 5분
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
            logErrorInfo(queryKey, error as AxiosError);

            // 메타 정보 또는 설정 기반 토스트 표시 여부 결정
            const showToastFromMeta = query.meta?.showToastOnError;
            const showToastFromConfig = shouldShowToast(queryKey);

            // 메타 정보가 있으면 우선, 없으면 설정 사용
            const showToast =
              showToastFromMeta !== undefined
                ? showToastFromMeta
                : showToastFromConfig;

            if (showToast) {
              const errorMessage = getErrorMessage(
                queryKey,
                error as AxiosError,
              );
              toast.error(errorMessage);
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, variables, context, mutation) => {
            // 🎯 전역 뮤테이션 에러 처리
            const queryKey = mutation.options.mutationKey || ["unknown"];

            // 개발 모드에서 디버깅 정보 출력
            logErrorInfo(queryKey, error as AxiosError);

            // 뮤테이션은 기본적으로 토스트 표시
            const showToast = mutation.meta?.showToastOnError !== false;

            if (showToast) {
              const errorMessage = getErrorMessage(
                queryKey,
                error as AxiosError,
              );
              toast.error(errorMessage);
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
