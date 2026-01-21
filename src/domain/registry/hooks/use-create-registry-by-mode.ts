"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { CreateExternalImageRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCreatePrivateExternalImage } from "@/api/generated/private-registry/private-registry";
import { useCreatePublicExternalImage } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * 레지스트리 이미지 생성 (모드에 따라 다른 API 사용)
 *
 * @param mode - 레지스트리 모드 (private | public)
 * @returns 레지스트리 이미지 생성 mutation
 */
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
