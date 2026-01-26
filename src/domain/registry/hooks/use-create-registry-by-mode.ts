"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { CreateExternalImageRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCreatePrivateExternalImage } from "@/api/generated/private-registry/private-registry";
import { useCreatePublicExternalImage } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 레지스트리 이미지 생성 mutation을 반환 */
export const useCreateRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<
  unknown,
  unknown,
  { data: CreateExternalImageRequest }
> => {
  const privateMutation = useCreatePrivateExternalImage();
  const publicMutation = useCreatePublicExternalImage();

  return mode === "private" ? privateMutation : publicMutation;
};
