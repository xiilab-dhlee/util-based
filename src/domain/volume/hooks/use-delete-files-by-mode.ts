"use client";

import { useAdminDeleteFiles } from "@/api/generated/admin-volume/admin-volume";
import { useDeleteFiles } from "@/api/generated/volume-file/volume-file";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 파일 삭제 mutation 반환 */
export const useDeleteFilesByMode = (mode: VolumeMode) => {
  const userMutation = useDeleteFiles();
  const adminMutation = useAdminDeleteFiles();

  return mode === "user" ? userMutation : adminMutation;
};
