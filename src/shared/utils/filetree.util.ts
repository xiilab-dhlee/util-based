import type { FileTreeType } from "@/shared/schemas/filetree.schema";

/**
 * 경로 배열에서 최상위 경로만 필터링하는 함수
 *
 * 하위 경로는 상위 경로에 포함되므로, 상위 경로만 남기고 중복을 제거합니다.
 * 예: ["/folder", "/folder/file1", "/folder/file2"] → ["/folder"]
 *
 * @param paths - 필터링할 경로 배열
 * @returns 최상위 경로만 포함된 배열
 */
export function filterToRootPaths(paths: string[]): string[] {
  if (paths.length === 0) return [];

  // 경로 길이순으로 정렬 (짧은 것이 상위 경로)
  const sorted = [...paths].sort((a, b) => a.length - b.length);
  const rootPaths: string[] = [];

  for (const path of sorted) {
    // 이미 추가된 상위 경로의 하위인지 확인
    // rootPath가 "/"인 경우 모든 경로를 자식으로 간주 (${rootPath}/가 "//"가 되는 문제 방지)
    const isChildOfExisting = rootPaths.some(
      (rootPath) =>
        path === rootPath ||
        rootPath === "/" ||
        path.startsWith(`${rootPath}/`),
    );

    if (!isChildOfExisting) {
      rootPaths.push(path);
    }
  }

  return rootPaths;
}

/** 압축 파일 확장자 목록 */
export const COMPRESSED_FILE_EXTENSIONS = [".zip", ".tar", ".tar.gz", ".tgz"];

/** 압축 파일 여부 확인 */
export const isCompressedFile = (path: string): boolean => {
  const lowerPath = path.toLowerCase();
  return COMPRESSED_FILE_EXTENSIONS.some((ext) => lowerPath.endsWith(ext));
};

interface MergeMetadata {
  fileCount?: number;
  directoryCount?: number;
}

interface CreateFolderNodeParams {
  folderName: string;
  parentPath: string;
}

/**
 * 새 폴더 노드 생성
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
    fileSize: "0",
    children: [],
  };
};

/**
 * 트리에 새 노드 추가
 */
export const addNodeToTree = (
  treeData: FileTreeType[],
  parentPath: string,
  newNode: FileTreeType,
): FileTreeType[] => {
  if (parentPath === "/" || parentPath === "") {
    const exists = treeData.some((node) => node.path === newNode.path);
    if (exists) return treeData;

    const directories = treeData.filter((node) => node.type === "directory");
    const files = treeData.filter((node) => node.type === "file");

    return [...directories, newNode, ...files].sort((a, b) => {
      if (a.type === "directory" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "directory") return 1;
      return a.name.localeCompare(b.name, "ko");
    });
  }

  return treeData.map((node) => {
    if (node.path === parentPath) {
      const exists = node.children.some((child) => child.path === newNode.path);
      if (exists) return node;

      const newChildren = [...node.children, newNode].sort((a, b) => {
        if (a.type === "directory" && b.type === "file") return -1;
        if (a.type === "file" && b.type === "directory") return 1;
        return a.name.localeCompare(b.name, "ko");
      });

      return {
        ...node,
        children: newChildren,
        // newNode.type에 따라 해당 카운트 증가
        ...(newNode.type === "directory" &&
          node.directoryCount !== undefined && {
            directoryCount: node.directoryCount + 1,
          }),
        ...(newNode.type === "file" &&
          node.fileCount !== undefined && {
            fileCount: node.fileCount + 1,
          }),
      };
    }

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
 * 트리의 특정 노드에 자식 병합
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
 * 트리에서 특정 노드들 제거
 */
export const removeNodesFromTree = (
  treeData: FileTreeType[],
  pathsToRemove: string[],
): FileTreeType[] => {
  const pathSet = new Set(pathsToRemove);

  return treeData
    .filter((node) => !pathSet.has(node.path))
    .map((node) => {
      if (node.children.length > 0) {
        const newChildren = removeNodesFromTree(node.children, pathsToRemove);

        // 자식 노드들의 count 집계
        const fileCount = newChildren.reduce((acc, child) => {
          if (child.type === "file") return acc + 1;
          return acc + (child.fileCount ?? 0);
        }, 0);

        const directoryCount = newChildren.reduce((acc, child) => {
          if (child.type === "directory")
            return acc + 1 + (child.directoryCount ?? 0);
          return acc;
        }, 0);

        return {
          ...node,
          children: newChildren,
          ...(node.fileCount !== undefined && { fileCount }),
          ...(node.directoryCount !== undefined && { directoryCount }),
        };
      }
      return node;
    });
};
