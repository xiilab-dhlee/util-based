import type {
  GetVolumeListOrder,
  GetVolumeListSort,
  VolumeFileItemResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { FileTreeType } from "@/shared/types/core.model";
import { getFileExtension } from "@/shared/utils/file.util";

// 파일 트리 관련 유틸리티 re-export (하위 호환성 유지)
export {
  addNodeToTree,
  COMPRESSED_FILE_EXTENSIONS,
  createFolderNode,
  isCompressedFile,
  mergeChildrenToTree,
  removeNodesFromTree,
} from "@/shared/utils/filetree.util";

/** 정렬 값을 API 파라미터로 변환 */
export const parseVolumeSortValue = (
  value: string | null,
): {
  sort: GetVolumeListSort;
  order: GetVolumeListOrder;
} | null => {
  if (!value) return null;

  // 마지막 '_'를 기준으로 분리 (예: "VOLUME_NAME_ASC" → ["VOLUME_NAME", "ASC"])
  const lastUnderscoreIndex = value.lastIndexOf("_");
  const sort = value.slice(0, lastUnderscoreIndex) as GetVolumeListSort;
  const order = value.slice(lastUnderscoreIndex + 1) as GetVolumeListOrder;

  return { sort, order };
};

export const getVolumeStorageTypeInfo = (storageType?: string) => {
  let text = "";
  let icon = "";

  if (storageType === "ASTRAGO") {
    text = "AstraGo Storage";
    icon = "Astrago";
  } else if (storageType === "ON_PREMISE") {
    text = "On-premise Storage";
    icon = "OnPremiseStorage";
  }

  return { text, icon };
};

export const convertToFileTreeType = (
  items: VolumeFileItemResponse[],
): FileTreeType[] => {
  return items.map((item) => ({
    id: item.path,
    name: item.name,
    path: item.path,
    type: item.type === "DIRECTORY" ? "directory" : "file",
    fileExtension: item.type === "FILE" ? getFileExtension(item.name) : null,
    fileSize: item.size != null ? String(item.size) : undefined,
    children: [],
  }));
};
