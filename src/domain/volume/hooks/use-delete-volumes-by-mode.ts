"use client";

import { useAdminDeleteVolumes } from "@/api/generated/admin-volume/admin-volume";
import { useDeleteVolumes } from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 볼륨 다중 삭제 mutation 반환 */
export const useDeleteVolumesByMode = (mode: VolumeMode) => {
  const userMutation = useDeleteVolumes();
  const adminMutation = useAdminDeleteVolumes();

  return mode === "user" ? userMutation : adminMutation;
};
