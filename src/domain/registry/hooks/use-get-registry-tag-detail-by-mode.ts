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

export type GetRegistryTagDetailParams =
  | GetPrivateImageTagDetailParams
  | GetPublicImageTagDetailParams;

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

/** mode에 따라 private 또는 public 이미지 태그 상세 조회 */
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
