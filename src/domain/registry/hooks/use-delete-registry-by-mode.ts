"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { DeleteImagesRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDeletePrivateImages } from "@/api/generated/private-registry/private-registry";
import { useDeletePublicImages } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/** mode에 따라 private 또는 public 레지스트리 이미지 삭제 mutation을 반환 */
export const useDeleteRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: DeleteImagesRequest }> => {
  const privateMutation = useDeletePrivateImages();
  const publicMutation = useDeletePublicImages();

  return mode === "private" ? privateMutation : publicMutation;
};
