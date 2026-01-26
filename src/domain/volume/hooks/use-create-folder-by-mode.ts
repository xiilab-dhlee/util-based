"use client";

import { useAdminCreateFolder } from "@/api/generated/admin-volume/admin-volume";
import { useCreateFolder } from "@/api/generated/volume-file/volume-file";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 폴더 생성 mutation 반환 */
export const useCreateFolderByMode = (mode: VolumeMode) => {
  const userMutation = useCreateFolder();
  const adminMutation = useAdminCreateFolder();

  return mode === "user" ? userMutation : adminMutation;
};
