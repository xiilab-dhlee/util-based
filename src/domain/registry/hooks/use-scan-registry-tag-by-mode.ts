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

/** mode에 따라 private 또는 public 이미지 태그 취약점 스캔 mutation을 반환 */
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
