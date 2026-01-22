"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type {
  ScanPrivateImageTagParams,
  VulnerabilityScanRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useScanPrivateImageTag } from "@/api/generated/private-registry/private-registry";
import { useScanPublicImageTag } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

type PrivateScanMutationVariables = {
  data: VulnerabilityScanRequest;
  params: ScanPrivateImageTagParams;
};

type PublicScanMutationVariables = {
  data: VulnerabilityScanRequest;
};

type ScanMutationVariables =
  | PrivateScanMutationVariables
  | PublicScanMutationVariables;

/**
 * 레지스트리 이미지 태그 취약점 스캔 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @returns 레지스트리 이미지 태그 스캔 mutation
 */
export const useScanRegistryTagByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, ScanMutationVariables> => {
  const privateMutation = useScanPrivateImageTag();
  const publicMutation = useScanPublicImageTag();

  return mode === "private"
    ? (privateMutation as UseMutationResult<
        unknown,
        unknown,
        ScanMutationVariables
      >)
    : (publicMutation as UseMutationResult<
        unknown,
        unknown,
        ScanMutationVariables
      >);
};
