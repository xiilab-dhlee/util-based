"use client";

import type { UseMutationResult } from "@tanstack/react-query";

import type { SnapshotImageRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useCreatePrivateSnapshotImage } from "@/api/generated/private-registry/private-registry";
import { useCreatePublicSnapshotImage } from "@/api/generated/public-registry/public-registry";
import type { RegistryMode } from "@/domain/registry/types/registry.type";

/**
 * mode에 따라 private 또는 public 스냅샷 이미지 생성 mutation을 반환
 */
export const useCreateSnapshotRegistryByMode = (
  mode: RegistryMode,
): UseMutationResult<unknown, unknown, { data: SnapshotImageRequest }> => {
  const privateMutation = useCreatePrivateSnapshotImage();
  const publicMutation = useCreatePublicSnapshotImage();

  return mode === "private" ? privateMutation : publicMutation;
};
