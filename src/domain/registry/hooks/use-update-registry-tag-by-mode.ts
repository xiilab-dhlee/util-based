"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { UpdateImageTagRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdatePrivateImageTag } from "@/api/generated/private-registry/private-registry";
import { useUpdatePublicImageTag } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * 레지스트리 이미지 태그 수정 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @returns 레지스트리 이미지 태그 수정 mutation
 */
export const useUpdateRegistryTagByMode = (
  mode: RegistryMode,
): UseMutationResult<
  unknown,
  unknown,
  { imageTagId: number; data: UpdateImageTagRequest }
> => {
  const privateMutation = useUpdatePrivateImageTag();
  const publicMutation = useUpdatePublicImageTag();

  return mode === "private" ? privateMutation : publicMutation;
};
