"use client";

import { useAdminDownload } from "@/api/generated/admin-volume/admin-volume";
import { useDownloadFiles } from "@/api/generated/volume-file/volume-file";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 파일 다운로드 mutation 반환 */
export const useDownloadFilesByMode = (mode: VolumeMode) => {
  const userMutation = useDownloadFiles();
  const adminMutation = useAdminDownload();

  return mode === "user" ? userMutation : adminMutation;
};
