"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import { useDeletePrivateImages } from "@/api/generated/private-registry/private-registry";
import { useDeletePublicImageTags } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * mode에 따라 private 또는 public 레지스트리 이미지 삭제 mutation을 반환
 * TODO: Public registry API가 변경되어 useDeletePublicImageTags를 사용 중.
 * 실제 이미지 삭제 API가 추가되면 수정 필요
 */
export const useDeleteRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: unknown }> => {
  const privateMutation = useDeletePrivateImages();
  const publicMutation = useDeletePublicImageTags();

  return mode === "private"
    ? privateMutation
    : (publicMutation as UseMutationResult<
        unknown,
        unknown,
        { data: unknown }
      >);
};
