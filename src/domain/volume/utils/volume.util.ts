import type { VolumeStorageType } from "@/domain/volume/schemas/volume.schema";

/**
 * 볼륨 스토리지 타입 정보 조회
 * @param storageType - 볼륨 스토리지 타입
 * @returns 타입 정보 (텍스트)
 */
export const getVolumeStorageTypeInfo = (storageType: VolumeStorageType) => {
  // 타입 표시 텍스트
  let text = "";

  if (storageType === "ASTRAGO") {
    text = "AstraGo";
  } else if (storageType === "LOCAL") {
    text = "On-premise Storage";
  }

  return { text };
};
