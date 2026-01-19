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

/**
 * 볼륨 파일 트리를 관리하는 훅
 *
 * ## 주요 기능
 * - Lazy Loading: 루트("/")는 자동 로드, 하위 폴더는 클릭 시 로드
 * - 체크 상태 전파: 부모 폴더가 체크된 상태에서 자식 로드 시 자동으로 체크 상태 적용
 *
 * ## 고려된 설계 사항
 *
 * ### 1. 중복 API 호출 방지
 * - `loadedPathsRef`: 이미 로드 완료된 경로 추적 → 재요청 방지
 * - `inFlightPathsRef`: 현재 요청 중인 경로 추적 → 동일 폴더 빠른 클릭 시 중복 요청 방지
 *
 * ### 2. volumeId 변경 시 상태 리셋
 * - useEffect에서 volumeId/enabled 변경 감지 시 캐시(loadedPathsRef, inFlightPathsRef) 및 에러 상태 초기화
 * - 현재 구조에서는 컴포넌트 언마운트/리마운트로 자동 초기화되지만, 방어적으로 명시적 리셋 수행
 *
 * ### 3. 로딩 상태 분리
 * - `isLoading`: 루트 로딩 상태 (전체 스피너 표시용)
 * - `loadingPaths`: 개별 폴더 로딩 상태 (폴더별 스피너 표시용)
 */
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
  const inFlightPathsRef = useRef<Set<string>>(new Set());

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
      if (inFlightPathsRef.current.has(path)) return;
      if (Number.isNaN(volumeId)) return;

      inFlightPathsRef.current.add(path);
      setLoadingPaths((prev) => new Set(prev).add(path));

      try {
        const response = await listFiles(volumeId, { path });
        const children = response?.children ?? [];
        const fileCount = response?.fileCount;
        const directoryCount = response?.directoryCount;
        const convertedChildren = convertToFileTreeType(children);

        if (path === "/") {
          setTreeData(convertedChildren);
          setIsError(false);
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
        inFlightPathsRef.current.delete(path);
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

    // volumeId 또는 enabled 변경 시 캐시 및 에러 상태 리셋
    loadedPathsRef.current = new Set();
    inFlightPathsRef.current = new Set();
    setIsError(false);

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
