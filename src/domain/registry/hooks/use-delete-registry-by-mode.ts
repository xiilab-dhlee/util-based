"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import { useDeletePublicImages } from "@/api/generated/admin-public-registry/admin-public-registry";
import type { DeleteImagesRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDeletePrivateImages } from "@/api/generated/private-registry/private-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * mode에 따라 private 또는 public 레지스트리 이미지 삭제 mutation을 반환
 *
 * Note: 이미지 삭제는 관리자 권한이 필요합니다.
 * - private: 일반 API 사용 (권한 체크는 서버에서 수행)
 * - public: 관리자 전용 API 사용
 */
export const useDeleteRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: DeleteImagesRequest }> => {
  const privateMutation = useDeletePrivateImages();
  const publicMutation = useDeletePublicImages();

  return mode === "private" ? privateMutation : publicMutation;
};
