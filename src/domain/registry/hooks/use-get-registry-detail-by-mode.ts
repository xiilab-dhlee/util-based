"use client";

import type {
  GetPrivateImageDetailParams,
  GetPublicImageDetailParams,
  RegistryDetailResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateImageDetailQueryError,
  useGetPrivateImageDetail,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicImageDetailQueryError,
  useGetPublicImageDetail,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** 레지스트리 이미지 상세 조회 파라미터 (private/public 공통) */
export type GetRegistryDetailParams =
  | GetPrivateImageDetailParams
  | GetPublicImageDetailParams;

/** 레지스트리 이미지 상세 조회 에러 타입 */
export type GetRegistryDetailQueryError =
  | GetPrivateImageDetailQueryError
  | GetPublicImageDetailQueryError;

interface UseGetRegistryDetailByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryDetailByModeResult {
  data: RegistryDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryDetailQueryError | null;
  refetch: () => void;
}

/**
 * 레지스트리 이미지 상세 조회 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @param params - 상세 조회 파라미터
 * @param options - React Query 옵션
 * @returns 레지스트리 이미지 상세 조회 결과 (unwrapped data)
 */
export const useGetRegistryDetailByMode = (
  mode: RegistryMode,
  params: GetRegistryDetailParams,
  options?: UseGetRegistryDetailByModeOptions,
): UseGetRegistryDetailByModeResult => {
  const privateQuery = useGetPrivateImageDetail(
    params as GetPrivateImageDetailParams,
    {
      query: {
        enabled: mode === "private" && (options?.query?.enabled ?? true),
      },
    },
  );

  const publicQuery = useGetPublicImageDetail(
    params as GetPublicImageDetailParams,
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
