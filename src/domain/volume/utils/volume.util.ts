import type {
  VolumeStatusType,
  VolumeStorageType,
} from "@/domain/volume/schemas/volume.schema";

/**
 * 볼륨 스토리지 타입 정보 조회
 * @param storageType - 볼륨 스토리지 타입
 * @returns 타입 정보 (텍스트)
 */
export const getVolumeStorageTypeInfo = (storageType: VolumeStorageType) => {
  // 타입 표시 텍스트
  let text = "";
  let icon = "";

  if (storageType === "ASTRAGO") {
    text = "AstraGo Storage";
    icon = "Astrago";
  } else if (storageType === "LOCAL") {
    text = "On-premise Storage";
    icon = "OnPremiseStorage";
  }

  return { text, icon };
};

/**
 * 소스코드 타입 정보 조회
 * @param type - 소스코드 타입
 * @returns 타입 정보 (텍스트, 태그)
 */
export const getVolumeStatusInfo = (type: VolumeStatusType) => {
  // 타입 표시 텍스트
  let text = "";

  if (type === "PUBLIC") {
    text = "공개";
  } else if (type === "PRIVATE") {
    text = "비공개";
  }

  return { text };
};
