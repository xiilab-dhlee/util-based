"use client";

import {
  type AdminGetVolumeDetailQueryError,
  useAdminGetVolumeDetail,
} from "@/api/generated/admin-volume/admin-volume";
import type { VolumeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetVolumeDetailQueryError,
  useGetVolumeDetail,
} from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

type GetVolumeDetailByModeQueryError =
  | GetVolumeDetailQueryError
  | AdminGetVolumeDetailQueryError;

interface UseGetVolumeDetailByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetVolumeDetailByModeResult {
  data: VolumeDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetVolumeDetailByModeQueryError | null;
  refetch: () => void;
}

/** mode에 따라 user 또는 admin 볼륨 상세 조회 */
export const useGetVolumeDetailByMode = (
  mode: VolumeMode,
  volumeId: number,
  options?: UseGetVolumeDetailByModeOptions,
): UseGetVolumeDetailByModeResult => {
  const userQuery = useGetVolumeDetail(volumeId, {
    query: {
      enabled: mode === "user" && (options?.query?.enabled ?? true),
    },
  });

  const adminQuery = useAdminGetVolumeDetail(volumeId, {
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
