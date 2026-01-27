"use client";

import { useAdminUpdateVolume } from "@/api/generated/admin-volume/admin-volume";
import type { UpdateVolumeRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useUpdateVolume } from "@/api/generated/volume/volume";
import type { VolumeMode } from "@/domain/volume/types/volume.type";

/** 볼륨 수정 응답 타입 */
export interface UpdateVolumeResponse {
  volumeId: number;
}

interface UseUpdateVolumeByModeResult {
  mutate: (
    variables: { volumeId: number; data: UpdateVolumeRequest },
    options?: {
      onSuccess?: (data: UpdateVolumeResponse) => void;
      onError?: (error: unknown) => void;
    },
  ) => void;
  isPending: boolean;
}

/** mode에 따라 user 또는 admin 볼륨 수정 */
export const useUpdateVolumeByMode = (
  mode: VolumeMode,
): UseUpdateVolumeByModeResult => {
  const userMutation = useUpdateVolume();
  const adminMutation = useAdminUpdateVolume();

  const mutation = mode === "user" ? userMutation : adminMutation;

  return {
    mutate: (variables, options) => {
      mutation.mutate(variables, {
        onSuccess: (data) => {
          // 볼륨 수정 응답에는 volumeId가 없으므로, 요청 변수에서 전달
          options?.onSuccess?.({ volumeId: data.volumeId });
        },
        onError: options?.onError,
      });
    },
    isPending: mutation.isPending,
  };
};
