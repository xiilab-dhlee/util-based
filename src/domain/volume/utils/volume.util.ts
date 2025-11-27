import type { VolumeStorageType } from "../schemas/volume.schema";

/**
 * 소스코드 타입 정보 조회
 * @param type - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
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
