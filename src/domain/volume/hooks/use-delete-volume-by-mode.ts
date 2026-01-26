"use client";

import { useAdminDeleteVolume } from "@/api/generated/admin-volume/admin-volume";
import { useDeleteVolume } from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 볼륨 삭제 mutation 반환 */
export const useDeleteVolumeByMode = (mode: VolumeMode) => {
  const userMutation = useDeleteVolume();
  const adminMutation = useAdminDeleteVolume();

  return mode === "user" ? userMutation : adminMutation;
};
