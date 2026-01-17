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
  /** 파일 트리 데이터 */
  treeData: FileTreeType[];
  /** 초기 로딩 상태 */
  isLoading: boolean;
  /** 현재 로딩 중인 경로들 */
  loadingPaths: Set<string>;
  /** 특정 경로의 하위 파일/폴더 로드 */
  loadChildren: (path: string) => Promise<void>;
}

/**
 * 볼륨 파일 트리 Lazy Loading 훅
 *
 * 경로 기반으로 파일 트리를 점진적으로 로드합니다.
 * 폴더 클릭 시 해당 경로의 하위 항목을 조회하여 기존 트리에 병합합니다.
 *
 * @param options - 훅 옵션 (volumeId, enabled)
 * @returns 트리 데이터 및 관련 상태/함수
 */
export const useVolumeFileTree = ({
  volumeId,
  enabled = true,
}: UseVolumeFileTreeOptions): UseVolumeFileTreeReturn => {
  // 파일 트리 데이터 상태 (전역 atom 사용 - volumeFileSelectedNodeInfoAtom과 동기화)
  const [treeData, setTreeData] = useAtom(volumeFileTreeDataAtom);
  // 체크된 노드 상태 업데이트용 setter
  const setCheckedNodes = useSetAtom(volumeFileCheckedNodesAtom);
  // 초기 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 현재 로딩 중인 경로들 (스피너 표시용)
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(new Set());

  // 이미 로드된 경로 추적 (중복 요청 방지)
  const loadedPathsRef = useRef<Set<string>>(new Set());

  /**
   * 부모 폴더가 체크된 상태면 새로 로드된 자식들도 체크 상태에 추가
   */
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

  /**
   * 특정 경로의 하위 파일/폴더를 로드하고 트리에 병합
   */
  const loadChildren = useCallback(
    async (path: string) => {
      // 이미 로드된 경로면 스킵
      if (loadedPathsRef.current.has(path)) {
        return;
      }

      // volumeId가 유효하지 않으면 스킵
      if (Number.isNaN(volumeId)) {
        return;
      }

      // 로딩 시작
      setLoadingPaths((prev) => new Set(prev).add(path));

      try {
        // listFiles의 반환값은 customInstance에 의해 언래핑되어
        // BaseResponseVolumeFileListResponse.data인 VolumeFileListResponse가 됨
        const response = await listFiles(volumeId, { path });
        const children = response?.children ?? [];
        const fileCount = response?.fileCount;
        const directoryCount = response?.directoryCount;
        const convertedChildren = convertToFileTreeType(children);

        // 루트 경로인 경우 트리 데이터 전체 설정
        if (path === "/") {
          setTreeData(convertedChildren);
        } else {
          // 하위 경로인 경우 기존 트리에 병합 (fileCount, directoryCount 포함)
          setTreeData((prev) =>
            mergeChildrenToTree(prev, path, convertedChildren, {
              fileCount,
              directoryCount,
            }),
          );

          // 부모 폴더가 체크된 상태면 새로 로드된 자식들도 체크
          updateCheckedNodesForChildren(path, convertedChildren);
        }

        // 로드 완료 표시
        loadedPathsRef.current.add(path);
      } catch (error) {
        // 에러 발생 시 재시도 가능하도록 loadedPaths에서 제거하지 않음
        console.error(`Failed to load children for path: ${path}`, error);
      } finally {
        // 로딩 종료
        setLoadingPaths((prev) => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
      }
    },
    [volumeId, setTreeData, updateCheckedNodesForChildren],
  );

  // 초기 루트 경로 로딩
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
    loadingPaths,
    loadChildren,
  };
};
