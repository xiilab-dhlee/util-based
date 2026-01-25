"use client";

import { useAtomValue } from "jotai";

import type {
  GetPrivateImageTagVulnerabilitiesParams,
  GetPublicImageTagVulnerabilitiesParams,
  PageableRequest,
  PageResponseVulnerabilityDetailResponse,
  VulnerabilityScanRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetPrivateImageTagVulnerabilitiesQueryError,
  useGetPrivateImageTagVulnerabilities,
} from "@/api/generated/private-registry/private-registry";
import {
  type GetPublicImageTagVulnerabilitiesQueryError,
  useGetPublicImageTagVulnerabilities,
} from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export type GetRegistryTagVulnerabilitiesQueryError =
  | GetPrivateImageTagVulnerabilitiesQueryError
  | GetPublicImageTagVulnerabilitiesQueryError;

interface RegistryTagVulnerabilitiesRequest {
  pageRequest: PageableRequest;
  request: VulnerabilityScanRequest;
}

interface UseGetRegistryTagVulnerabilitiesByModeOptions {
  query?: {
    enabled?: boolean;
  };
}

interface UseGetRegistryTagVulnerabilitiesByModeResult {
  data: PageResponseVulnerabilityDetailResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: GetRegistryTagVulnerabilitiesQueryError | null;
  refetch: () => void;
}

/** mode에 따라 private 또는 public 이미지 태그 취약점 목록 조회 */
export const useGetRegistryTagVulnerabilitiesByMode = (
  mode: RegistryMode,
  params: RegistryTagVulnerabilitiesRequest,
  options?: UseGetRegistryTagVulnerabilitiesByModeOptions,
): UseGetRegistryTagVulnerabilitiesByModeResult => {
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;

  const privateParams: GetPrivateImageTagVulnerabilitiesParams = {
    ...params,
    workspaceFilter: { workspaceId: workspaceId ?? 0 },
  };

  const publicParams: GetPublicImageTagVulnerabilitiesParams = {
    ...params,
  };

  const privateQuery = useGetPrivateImageTagVulnerabilities(privateParams, {
    query: {
      enabled:
        mode === "private" &&
        !!workspaceId &&
        (options?.query?.enabled ?? true),
    },
  });

  const publicQuery = useGetPublicImageTagVulnerabilities(publicParams, {
    query: {
      enabled: mode === "public" && (options?.query?.enabled ?? true),
    },
  });

  const query = mode === "private" ? privateQuery : publicQuery;

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
