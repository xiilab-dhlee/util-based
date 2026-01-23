"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { UpdateImageTagRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdatePrivateImageTag } from "@/api/generated/private-registry/private-registry";
import { useUpdatePublicImageTag } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 이미지 태그 수정 mutation을 반환 */
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
