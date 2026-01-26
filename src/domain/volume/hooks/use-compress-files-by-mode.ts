"use client";

import { useAdminCompress } from "@/api/generated/admin-volume/admin-volume";
import { useCompressFiles } from "@/api/generated/volume-file/volume-file";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 파일 압축 mutation 반환 */
export const useCompressFilesByMode = (mode: VolumeMode) => {
  const userMutation = useCompressFiles();
  const adminMutation = useAdminCompress();

  return mode === "user" ? userMutation : adminMutation;
};
