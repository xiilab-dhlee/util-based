"use client";

import type {
  CheckImageTagExistsParams,
  CheckPrivateImageTagExistsParams,
  ImageTagExistsResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { checkPrivateImageTagExists } from "@/api/generated/private-registry/private-registry";
import { checkImageTagExists } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 이미지 태그 존재 여부 확인 */
export const checkImageTagExistsByMode = async (
  mode: RegistryMode,
  params: {
    harborImageName: string;
    tagName: string;
    workspaceId?: number;
  },
): Promise<ImageTagExistsResponse> => {
  if (mode === "private") {
    const privateParams: CheckPrivateImageTagExistsParams = {
      request: {
        harborImageName: params.harborImageName,
        tagName: params.tagName,
      },
      workspaceFilter: {
        workspaceId: params.workspaceId,
      },
    };
    return checkPrivateImageTagExists(privateParams);
  }

  const publicParams: CheckImageTagExistsParams = {
    harborImageName: params.harborImageName,
    tagName: params.tagName,
  };
  return checkImageTagExists(publicParams);
};
