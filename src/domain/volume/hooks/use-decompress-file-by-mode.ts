"use client";

import { useAdminDecompress } from "@/api/generated/admin-volume/admin-volume";
import { useDecompressFile } from "@/api/generated/volume-file/volume-file";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 파일 압축 해제 mutation 반환 */
export const useDecompressFileByMode = (mode: VolumeMode) => {
  const userMutation = useDecompressFile();
  const adminMutation = useAdminDecompress();

  return mode === "user" ? userMutation : adminMutation;
};
