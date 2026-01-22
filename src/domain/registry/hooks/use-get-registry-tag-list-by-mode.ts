"use client";

import type {
  GetPrivateImageTagListParams,
  GetPublicImageTagListParams,
  PageResponseImageTagListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateImageTagListQueryError,
  useGetPrivateImageTagList,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicImageTagListQueryError,
  useGetPublicImageTagList,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 레지스트리 태그 목록 조회 파라미터 (API 구조 그대로 사용) */
export type GetRegistryTagListParams =
  | GetPrivateImageTagListParams
  | GetPublicImageTagListParams;

/** 레지스트리 태그 목록 조회 에러 타입 */
export type GetRegistryTagListQueryError =
  | GetPrivateImageTagListQueryError
  | GetPublicImageTagListQueryError;

interface UseGetRegistryTagListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryTagListByModeResult {
  data: PageResponseImageTagListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryTagListQueryError | null;
  refetch: () => void;
}

/**
 * 레지스트리 이미지 태그 목록 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - API 파라미터 (중첩 구조 그대로 전달)
 * @param options - React Query 옵션
 * @returns 레지스트리 태그 목록 조회 결과 (unwrapped data)
 */
export const useGetRegistryTagListByMode = (
  mode: RegistryMode,
  params: GetRegistryTagListParams,
  options?: UseGetRegistryTagListByModeOptions,
): UseGetRegistryTagListByModeResult => {
  const privateQuery = useGetPrivateImageTagList(
    params as GetPrivateImageTagListParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageTagList(
    params as GetPublicImageTagListParams,
    {
      query: {
        enabled: mode === "public" && (options?.query?.enabled ?? true),
      },
    },
  );

  const query = mode === "private" ? privateQuery : publicQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
