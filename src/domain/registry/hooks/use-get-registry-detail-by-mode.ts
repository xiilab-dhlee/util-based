"use client";

import { useAtomValue } from "jotai";

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
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export type GetRegistryDetailQueryError =
  | GetPrivateImageDetailQueryError
  | GetPublicImageDetailQueryError;

export type GetRegistryDetailParams =
  | GetPrivateImageDetailParams
  | GetPublicImageDetailParams;

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

/** mode에 따라 private 또는 public 레지스트리 이미지 상세 조회 */
export const useGetRegistryDetailByMode = (
  mode: RegistryMode,
  params: GetRegistryDetailParams,
  options?: UseGetRegistryDetailByModeOptions,
): UseGetRegistryDetailByModeResult => {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const privateQuery = useGetPrivateImageDetail(
    { ...params, workspaceId } as GetPrivateImageDetailParams,
    {
      query: {
        enabled:
          mode === "private" &&
          !!workspaceId &&
          (options?.query?.enabled ?? true),
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
