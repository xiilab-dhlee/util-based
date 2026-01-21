"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { DeleteImagesRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useDeletePrivateImages } from "@/api/generated/private-registry/private-registry";
// TODO: public 삭제 API가 추가되면 아래 import 활성화
// import { useDeletePublicImages } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * mode에 따라 private 또는 public 레지스트리 이미지 삭제 mutation을 반환합니다.
 *
 * Note: 현재 public 삭제 API가 없으므로 private mutation만 사용됩니다.
 * public API가 추가되면 아래 주석 처리된 부분을 활성화하세요.
 */
export const useDeleteRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: DeleteImagesRequest }> => {
  const privateMutation = useDeletePrivateImages();
  // TODO: public 삭제 API가 추가되면 아래 코드 활성화
  // const publicMutation = useDeletePublicImages();
  // return mode === "private" ? privateMutation : publicMutation;

  // 현재는 private만 지원 (public API 추가 시 위 코드로 교체)
  return privateMutation;
};
