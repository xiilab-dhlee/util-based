"use client";

import { useAdminUpdateVolume } from "@/api/generated/admin-volume/admin-volume";
import { useUpdateVolume } from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** mode에 따라 user 또는 admin 볼륨 수정 mutation 반환 */
export const useUpdateVolumeByMode = (mode: VolumeMode) => {
  const userMutation = useUpdateVolume();
  const adminMutation = useAdminUpdateVolume();

  return mode === "user" ? userMutation : adminMutation;
};
