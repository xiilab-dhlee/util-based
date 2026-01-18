"use client";

import { useAtom, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { listFiles } from "@/api/generated/volume/volume";
import {
  volumeFileCheckedNodesAtom,
  volumeFileTreeDataAtom,
} from "@/domain/volume/state/volume.atom";
import {
  convertToFileTreeType,
  mergeChildrenToTree,
} from "@/domain/volume/utils/volume.util";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { collectAllDescendantPaths } from "@/shared/state/filetree.atom";

interface UseVolumeFileTreeOptions {
  volumeId: number;
  enabled?: boolean;
}

interface UseVolumeFileTreeReturn {
  treeData: FileTreeType[];
  isLoading: boolean;
  isError: boolean;
  loadingPaths: Set<string>;
  loadChildren: (path: string) => Promise<void>;
}

export const useVolumeFileTree = ({
  volumeId,
  enabled = true,
}: UseVolumeFileTreeOptions): UseVolumeFileTreeReturn => {
  const [treeData, setTreeData] = useAtom(volumeFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());
  const loadedPathsRef = useRef<Set<string>>(new Set());

  const updateCheckedNodesForChildren = useCallback(
    (parentPath: string, children: FileTreeType[]) => {
      setCheckedNodes((prev) => {
        // 부모 폴더가 체크되어 있지 않으면 아무것도 하지 않음
        if (!prev.has(parentPath)) {
          return prev;
        }

        // 부모가 체크되어 있으면 모든 자식 경로를 체크 상태에 추가
        const next = new Set(prev);
        for (const child of children) {
          const childPaths = collectAllDescendantPaths(child);
          for (const path of childPaths) {
            next.add(path);
          }
        }
        return next;
      });
    },
    [setCheckedNodes],
  );

  const loadChildren = useCallback(
    async (path: string) => {
      if (loadedPathsRef.current.has(path)) return;
      if (Number.isNaN(volumeId)) return;

      setLoadingPaths((prev) => new Set(prev).add(path));

      try {
        const response = await listFiles(volumeId, { path });
        const children = response?.children ?? [];
        const fileCount = response?.fileCount;
        const directoryCount = response?.directoryCount;
        const convertedChildren = convertToFileTreeType(children);

        if (path === "/") {
          setTreeData(convertedChildren);
        } else {
          setTreeData((prev) =>
            mergeChildrenToTree(prev, path, convertedChildren, {
              fileCount,
              directoryCount,
            }),
          );
          updateCheckedNodesForChildren(path, convertedChildren);
        }

        loadedPathsRef.current.add(path);
      } catch (error) {
        console.error(`Failed to load children for path: ${path}`, error);
        if (path === "/") {
          setIsError(true);
        }
      } finally {
        setLoadingPaths((prev) => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
      }
    },
    [volumeId, setTreeData, updateCheckedNodesForChildren],
  );

  useEffect(() => {
    if (!enabled || Number.isNaN(volumeId)) {
      return;
    }

    const loadRoot = async () => {
      setIsLoading(true);
      await loadChildren("/");
      setIsLoading(false);
    };

    loadRoot();
  }, [enabled, volumeId, loadChildren]);

  return {
    treeData,
    isLoading,
    isError,
    loadingPaths,
    loadChildren,
  };
};
