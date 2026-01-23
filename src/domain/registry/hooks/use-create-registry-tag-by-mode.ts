"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { AddImageTagRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useAddPrivateImageTag } from "@/api/generated/private-registry/private-registry";
import { useAddPublicImageTag } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 이미지 태그 생성 mutation을 반환 */
export const useCreateRegistryTagByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: AddImageTagRequest }> => {
  const privateMutation = useAddPrivateImageTag();
  const publicMutation = useAddPublicImageTag();

  return mode === "private" ? privateMutation : publicMutation;
};
