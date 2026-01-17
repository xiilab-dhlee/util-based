import type { VolumeFileItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";

/**
 * 볼륨 스토리지 타입 정보 조회
 * @param storageType - 볼륨 스토리지 타입 (orval 생성 타입 또는 Zod 스키마 타입)
 * @returns 타입 정보 (텍스트, 아이콘)
 */
export const getVolumeStorageTypeInfo = (storageType?: string) => {
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
export const getVolumeStatusInfo = (status?: boolean) => {
  let text = "";
  let icon = "";

  if (status) {
    text = "공개";
    icon = "";
  } else {
    text = "비공개";
    icon = "Lock";
  }

  return { text, icon };
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

/**
 * 병합 시 함께 업데이트할 부모 노드 메타데이터
 */
interface MergeMetadata {
  /** 폴더 내 파일 개수 */
  fileCount?: number;
  /** 폴더 내 디렉토리 개수 */
  directoryCount?: number;
}

/**
 * 새 폴더 노드 생성을 위한 파라미터
 */
interface CreateFolderNodeParams {
  /** 폴더명 */
  folderName: string;
  /** 부모 경로 */
  parentPath: string;
}

/**
 * 새 폴더를 위한 FileTreeType 노드 생성
 *
 * @param params - 폴더 노드 생성 파라미터
 * @returns 새로운 FileTreeType 노드
 */
export const createFolderNode = ({
  folderName,
  parentPath,
}: CreateFolderNodeParams): FileTreeType => {
  const fullPath =
    parentPath === "/" || parentPath === ""
      ? `/${folderName}`
      : `${parentPath}/${folderName}`;

  return {
    id: fullPath,
    name: folderName,
    path: fullPath,
    type: "directory",
    fileExtension: null,
    children: [],
  };
};

/**
 * 트리의 특정 경로에 새 노드를 추가
 * 재귀적으로 트리를 탐색하여 parentPath와 일치하는 노드를 찾아 children에 새 노드를 추가합니다.
 *
 * @param treeData - 기존 트리 데이터
 * @param parentPath - 새 노드를 추가할 부모 경로
 * @param newNode - 추가할 새 노드
 * @returns 새 노드가 추가된 트리 데이터
 */
export const addNodeToTree = (
  treeData: FileTreeType[],
  parentPath: string,
  newNode: FileTreeType,
): FileTreeType[] => {
  // 루트 경로에 추가하는 경우
  if (parentPath === "/" || parentPath === "") {
    // 이미 같은 이름의 노드가 있는지 확인
    const exists = treeData.some((node) => node.path === newNode.path);
    if (exists) return treeData;

    // 디렉토리가 먼저 오고, 그 다음 파일이 오도록 정렬하며 추가
    const directories = treeData.filter((node) => node.type === "directory");
    const files = treeData.filter((node) => node.type === "file");

    return [...directories, newNode, ...files].sort((a, b) => {
      // 디렉토리가 먼저
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      // 같은 타입이면 이름순
      return a.name.localeCompare(b.name, "ko");
    });
  }

  return treeData.map((node) => {
    // 현재 노드가 타겟 부모인 경우
    if (node.path === parentPath) {
      // 이미 같은 이름의 노드가 있는지 확인
      const exists = node.children.some((child) => child.path === newNode.path);
      if (exists) return node;

      // 디렉토리가 먼저, 그 다음 파일, 이름순 정렬
      const newChildren = [...node.children, newNode].sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.localeCompare(b.name, "ko");
      });

      return {
        ...node,
        children: newChildren,
        // directoryCount 업데이트 (있는 경우)
        ...(node.directoryCount !== undefined && {
          directoryCount: node.directoryCount + 1,
        }),
      };
    }
    // 자식에서 재귀 탐색
    if (node.children.length > 0) {
      return {
        ...node,
        children: addNodeToTree(node.children, parentPath, newNode),
      };
    }
    return node;
  });
};

/**
 * 기존 트리에 특정 경로의 children을 병합
 * 재귀적으로 트리를 탐색하여 parentPath와 일치하는 노드를 찾아 children을 업데이트합니다.
 *
 * @param treeData - 기존 트리 데이터
 * @param parentPath - children을 추가할 부모 경로
 * @param children - 추가할 자식 노드들
 * @param metadata - 부모 노드에 업데이트할 메타데이터 (fileCount, directoryCount)
 * @returns 병합된 새로운 트리 데이터
 */
export const mergeChildrenToTree = (
  treeData: FileTreeType[],
  parentPath: string,
  children: FileTreeType[],
  metadata?: MergeMetadata,
): FileTreeType[] => {
  return treeData.map((node) => {
    // 현재 노드가 타겟인 경우
    if (node.path === parentPath) {
      return {
        ...node,
        children,
        ...(metadata?.fileCount !== undefined && {
          fileCount: metadata.fileCount,
        }),
        ...(metadata?.directoryCount !== undefined && {
          directoryCount: metadata.directoryCount,
        }),
      };
    }
    // 자식에서 재귀 탐색
    if (node.children.length > 0) {
      return {
        ...node,
        children: mergeChildrenToTree(
          node.children,
          parentPath,
          children,
          metadata,
        ),
      };
    }
    return node;
  });
};

/**
 * 트리에서 특정 경로들의 노드를 제거
 * 재귀적으로 트리를 탐색하여 pathsToRemove에 포함된 경로의 노드를 제거합니다.
 *
 * @param treeData - 기존 트리 데이터
 * @param pathsToRemove - 제거할 경로 배열
 * @returns 노드가 제거된 새로운 트리 데이터
 */
export const removeNodesFromTree = (
  treeData: FileTreeType[],
  pathsToRemove: string[],
): FileTreeType[] => {
  const pathSet = new Set(pathsToRemove);

  return treeData
    .filter((node) => !pathSet.has(node.path))
    .map((node) => {
      // 자식이 있으면 재귀적으로 제거
      if (node.children.length > 0) {
        return {
          ...node,
          children: removeNodesFromTree(node.children, pathsToRemove),
        };
      }
      return node;
    });
};
