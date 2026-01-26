"use client";

import {
  type AdminGetVolumeListQueryError,
  useAdminGetVolumeList,
} from "@/api/generated/admin-volume/admin-volume";
import type {
  AdminGetVolumeListParams,
  GetVolumeListParams,
  PageResponseVolumeListResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetVolumeListQueryError,
  useGetVolumeList,
} from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

type GetVolumeListByModeQueryError =
  | GetVolumeListQueryError
  | AdminGetVolumeListQueryError;

export type GetVolumeListByModeParams =
  | GetVolumeListParams
  | AdminGetVolumeListParams;

interface UseGetVolumeListByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetVolumeListByModeResult {
  data: PageResponseVolumeListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetVolumeListByModeQueryError | null;
  refetch: () => void;
}

/** mode에 따라 user 또는 admin 볼륨 목록 조회 */
export const useGetVolumeListByMode = (
  mode: VolumeMode,
  params: GetVolumeListByModeParams,
  options?: UseGetVolumeListByModeOptions,
): UseGetVolumeListByModeResult => {
  const userQuery = useGetVolumeList(params as GetVolumeListParams, {
    query: {
      enabled: mode === "user" && (options?.query?.enabled ?? true),
    },
  });

  const adminQuery = useAdminGetVolumeList(params as AdminGetVolumeListParams, {
    query: {
      enabled: mode === "admin" && (options?.query?.enabled ?? true),
    },
  });

  const query = mode === "user" ? userQuery : adminQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
