"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { DeleteImageTagsRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDeletePrivateImageTags } from "@/api/generated/private-registry/private-registry";
import { useDeletePublicImageTags } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 이미지 태그 삭제 mutation을 반환 */
export const useDeleteRegistryTagByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: DeleteImageTagsRequest }> => {
  const privateMutation = useDeletePrivateImageTags();
  const publicMutation = useDeletePublicImageTags();

  return mode === "private" ? privateMutation : publicMutation;
};
