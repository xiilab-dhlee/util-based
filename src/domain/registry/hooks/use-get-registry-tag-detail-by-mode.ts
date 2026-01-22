"use client";

import type {
  GetPrivateImageTagDetailParams,
  GetPublicImageTagDetailParams,
  ImageTagDetailResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateImageTagDetailQueryError,
  useGetPrivateImageTagDetail,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicImageTagDetailQueryError,
  useGetPublicImageTagDetail,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 레지스트리 태그 상세 조회 파라미터 (API 구조 그대로 사용) */
export type GetRegistryTagDetailParams =
  | GetPrivateImageTagDetailParams
  | GetPublicImageTagDetailParams;

/** 레지스트리 태그 상세 조회 에러 타입 */
export type GetRegistryTagDetailQueryError =
  | GetPrivateImageTagDetailQueryError
  | GetPublicImageTagDetailQueryError;

interface UseGetRegistryTagDetailByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryTagDetailByModeResult {
  data: ImageTagDetailResponse | undefined;
  isFetching: boolean;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryTagDetailQueryError | null;
  refetch: () => void;
}

/**
 * 레지스트리 이미지 태그 상세 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - API 파라미터 (중첩 구조 그대로 전달)
 * @param options - React Query 옵션
 * @returns 레지스트리 태그 상세 조회 결과 (unwrapped data)
 */
export const useGetRegistryTagDetailByMode = (
  mode: RegistryMode,
  params: GetRegistryTagDetailParams,
  options?: UseGetRegistryTagDetailByModeOptions,
): UseGetRegistryTagDetailByModeResult => {
  const privateQuery = useGetPrivateImageTagDetail(
    params as GetPrivateImageTagDetailParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageTagDetail(
    params as GetPublicImageTagDetailParams,
    {
      query: {
        enabled: mode === "public" && (options?.query?.enabled ?? true),
      },
    },
  );

  const query = mode === "private" ? privateQuery : publicQuery;

  return {
    data: query.data,
    isFetching: query.isFetching,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
