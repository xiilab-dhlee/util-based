"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { DeleteImageTagsRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDeletePrivateImageTags } from "@/api/generated/private-registry/private-registry";
import { useDeletePublicImageTags } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * 레지스트리 이미지 태그 삭제 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @returns 레지스트리 태그 삭제 mutation
 */
export const useDeleteRegistryTagByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: DeleteImageTagsRequest }> => {
  const privateMutation = useDeletePrivateImageTags();
  const publicMutation = useDeletePublicImageTags();

  return mode === "private" ? privateMutation : publicMutation;
};
