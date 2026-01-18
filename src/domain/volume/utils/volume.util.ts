import type { VolumeFileItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";

export const getVolumeStorageTypeInfo = (storageType?: string) => {
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

export const convertToFileTreeType = (
  items: VolumeFileItemResponse[],
): FileTreeType[] => {
  return items.map((item) => ({
    id: item.path,
    name: item.name,
    path: item.path,
    type: item.type === "DIRECTORY" ? "directory" : "file",
    fileExtension: item.type === "FILE" ? getFileExtension(item.name) : null,
    fileSize: item.size ? String(item.size) : undefined,
    children: [],
  }));
};

const getFileExtension = (fileName: string): string | null => {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return null;
  }
  return fileName.slice(lastDotIndex + 1);
};

interface MergeMetadata {
  fileCount?: number;
  directoryCount?: number;
}

interface CreateFolderNodeParams {
  folderName: string;
  parentPath: string;
}

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
        ...(node.directoryCount !== undefined && {
          directoryCount: node.directoryCount + 1,
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

export const removeNodesFromTree = (
  treeData: FileTreeType[],
  pathsToRemove: string[],
): FileTreeType[] => {
  const pathSet = new Set(pathsToRemove);

  return treeData
    .filter((node) => !pathSet.has(node.path))
    .map((node) => {
      if (node.children.length > 0) {
        return {
          ...node,
          children: removeNodesFromTree(node.children, pathsToRemove),
        };
      }
      return node;
    });
};
