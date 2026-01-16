import type {
  VolumeDetailResponseVolumeType,
  VolumeFileItemResponse,
  VolumeListResponseVolumeType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type {
  VolumeStatusType,
  VolumeStorageType,
} from "@/domain/volume/schemas/volume.schema";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";

/**
 * 볼륨 스토리지 타입 정보 조회
 * @param storageType - 볼륨 스토리지 타입 (orval 생성 타입 또는 Zod 스키마 타입)
 * @returns 타입 정보 (텍스트, 아이콘)
 */
export const getVolumeStorageTypeInfo = (
  storageType:
    | VolumeListResponseVolumeType
    | VolumeDetailResponseVolumeType
    | VolumeStorageType,
) => {
  // 타입 표시 텍스트
  let text = "";
  let icon = "";

  if (storageType === "ASTRAGO") {
    text = "AstraGo Storage";
    icon = "Astrago";
  } else if (storageType === "ON_PREMISE" || storageType === "LOCAL") {
    text = "On-premise Storage";
    icon = "OnPremiseStorage";
  }

  return { text, icon };
};

/**
 * 볼륨 공개 여부 정보 조회
 * @param status - 공개 여부 (boolean 또는 "PUBLIC" | "PRIVATE" 문자열)
 * @returns 타입 정보 (텍스트, 아이콘)
 */
export const getVolumeStatusInfo = (status: boolean | VolumeStatusType) => {
  const isPublic = typeof status === "boolean" ? status : status === "PUBLIC";

  if (isPublic) {
    return { text: "공개", icon: "" };
  }
  return { text: "비공개", icon: "Lock" };
};

/**
 * VolumeFileItemResponse를 FileTreeType으로 변환
 * API 응답 타입을 내부 파일 트리 타입으로 변환합니다.
 */
export const convertToFileTreeType = (
  items: VolumeFileItemResponse[],
): FileTreeType[] => {
  return items.map((item) => ({
    id: item.path, // path를 고유 ID로 사용
    name: item.name,
    path: item.path,
    type: item.type === "DIRECTORY" ? "directory" : "file",
    fileExtension: item.type === "FILE" ? getFileExtension(item.name) : null,
    fileSize: item.size ? String(item.size) : undefined,
    children: [], // 하위 노드는 별도 API 호출로 가져옴
  }));
};

/**
 * 파일 이름에서 확장자 추출
 */
const getFileExtension = (fileName: string): string | null => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return null;
  }
  return fileName.slice(lastDotIndex + 1);
};
