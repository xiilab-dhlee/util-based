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

export type GetRegistryTagListParams =
  | GetPrivateImageTagListParams
  | GetPublicImageTagListParams;

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

/** mode에 따라 private 또는 public 이미지 태그 목록 조회 */
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
