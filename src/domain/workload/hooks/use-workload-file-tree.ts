"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";

import { workloadListFiles } from "@/api/generated/workload/workload";
import {
  workloadFileCheckedNodesAtom,
  workloadFileSelectedNodeInfoAtom,
  workloadFileTreeDataAtom,
} from "@/domain/workload/state/workload.atom";
import { convertWorkloadFileToTreeType } from "@/domain/workload/utils/workload.util";
import type { FileTreeType } from "@/shared/schemas/filetree.schema";
import { collectAllDescendantPaths } from "@/shared/state/filetree.atom";
import { mergeChildrenToTree } from "@/shared/utils/filetree.util";

interface UseWorkloadFileTreeOptions {
  workspaceId: number;
  workloadResourceName: string;
  podName?: string | null;
  enabled?: boolean;
}

interface UseWorkloadFileTreeReturn {
  treeData: FileTreeType[];
  isLoading: boolean;
  isError: boolean;
  loadingPaths: Set<string>;
}

/**
 * 워크로드 파일 트리를 관리하는 훅
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
 * ### 2. workspaceId/workloadResourceName 변경 시 상태 리셋
 * - useEffect에서 변경 감지 시 캐시(loadedPathsRef, inFlightPathsRef) 및 에러 상태 초기화
 *
 * ### 3. 로딩 상태 분리
 * - `isLoading`: 루트 로딩 상태 (전체 스피너 표시용)
 * - `loadingPaths`: 개별 폴더 로딩 상태 (폴더별 스피너 표시용)
 */
export const useWorkloadFileTree = ({
  workspaceId,
  workloadResourceName,
  podName,
  enabled = true,
}: UseWorkloadFileTreeOptions): UseWorkloadFileTreeReturn => {
  const [treeData, setTreeData] = useAtom(workloadFileTreeDataAtom);
  const setCheckedNodes = useSetAtom(workloadFileCheckedNodesAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);
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
      if (!workspaceId || !workloadResourceName) return;

      inFlightPathsRef.current.add(path);
      setLoadingPaths((prev) => new Set(prev).add(path));

      try {
        const response = await workloadListFiles(
          workspaceId,
          workloadResourceName,
          { path, podName: podName || undefined },
        );

        const children = response?.children ?? [];
        const fileCount = response?.fileCount;
        const directoryCount = response?.directoryCount;
        const convertedChildren = convertWorkloadFileToTreeType(children);

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
    [
      workspaceId,
      workloadResourceName,
      podName,
      setTreeData,
      updateCheckedNodesForChildren,
    ],
  );

  // 루트 로드 (최초 마운트 시)
  useEffect(() => {
    if (!enabled || !workspaceId || !workloadResourceName) {
      return;
    }

    // workspaceId 또는 workloadResourceName 변경 시 캐시 및 에러 상태 리셋
    loadedPathsRef.current = new Set();
    inFlightPathsRef.current = new Set();
    setIsError(false);

    const loadRoot = async () => {
      setIsLoading(true);
      await loadChildren("/");
      setIsLoading(false);
    };

    loadRoot();
  }, [enabled, workspaceId, workloadResourceName, loadChildren]);

  // 선택된 노드가 디렉토리인 경우 자동으로 하위 파일 로드 (반응형 패턴)
  const selectedNodePath = selectedNode?.path;
  const selectedNodeType = selectedNode?.type;
  useEffect(() => {
    if (!selectedNodePath) return;
    if (selectedNodeType !== "directory") return;
    // 이미 로드된 경로는 스킵 (loadChildren 내부에서도 체크하지만 여기서 먼저 필터링)
    if (loadedPathsRef.current.has(selectedNodePath)) return;

    loadChildren(selectedNodePath);
  }, [selectedNodePath, selectedNodeType, loadChildren]);

  return {
    treeData,
    isLoading,
    isError,
    loadingPaths,
  };
};
