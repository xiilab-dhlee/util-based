"use client";

import { useAtom } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { volumeFileCheckedNodesAtom } from "@/domain/volume/state/volume.atom";
import type { FileCheckboxProps } from "@/shared/components/tree/custom-file-tree";
import {
  collectAllDescendantPaths,
  getAncestorPaths,
} from "@/shared/state/filetree.atom";

/**
 * VolumeFileCheckbox 컴포넌트
 *
 * 볼륨 파일 트리에서 개별 파일/디렉토리의 선택 상태를 관리하는 체크박스 컴포넌트입니다.
 * Jotai atom을 사용하여 전역 상태로 체크된 노드들을 관리하며,
 * 체크박스의 상태 변경 시 자동으로 전역 상태를 업데이트합니다.
 *
 * 디렉토리(폴더)의 경우:
 * - 체크 시: 해당 폴더와 모든 하위 파일/폴더가 체크됩니다.
 * - 체크 해제 시: 해당 폴더와 모든 하위 파일/폴더가 체크 해제됩니다.
 *
 * @param activeKey - 체크박스가 연결된 파일/디렉토리의 고유 키 (경로)
 * @param type - 노드 타입 (file 또는 directory)
 * @param node - 노드 데이터 (하위 노드 접근용)
 * @returns 체크박스 UI 컴포넌트
 */
export function VolumeFileCheckbox({
  activeKey,
  type,
  node,
}: FileCheckboxProps) {
  const [checkedNodes, setCheckedNodes] = useAtom(volumeFileCheckedNodesAtom);

  // 디렉토리인 경우 모든 하위 경로를 미리 계산
  const descendantPaths = useMemo(() => {
    if (type === "directory") {
      return collectAllDescendantPaths(node);
    }
    return [activeKey];
  }, [type, node, activeKey]);

  // 현재 노드의 체크 상태 계산
  // 디렉토리: 모든 하위 노드가 체크되어 있으면 체크됨
  // 파일: 해당 파일이 체크되어 있으면 체크됨
  const isChecked = useMemo(() => {
    if (type === "file") {
      return checkedNodes.has(activeKey);
    }
    // 디렉토리: 자신을 포함한 모든 하위 노드가 체크되어 있어야 체크됨
    return descendantPaths.every((path) => checkedNodes.has(path));
  }, [type, activeKey, descendantPaths, checkedNodes]);

  // 디렉토리의 부분 선택 상태 계산 (일부만 체크된 경우)
  const isIndeterminate = useMemo(() => {
    if (type === "file") return false;
    // 전체 체크도 아니고, 전체 미체크도 아닌 상태
    const checkedCount = descendantPaths.filter((path) =>
      checkedNodes.has(path),
    ).length;
    return checkedCount > 0 && checkedCount < descendantPaths.length;
  }, [type, descendantPaths, checkedNodes]);

  /**
   * 체크박스 상태 변경 핸들러
   *
   * 체크 시: 해당 노드와 모든 하위 노드 체크
   * 체크 해제 시: 해당 노드, 모든 하위 노드, 그리고 상위 폴더들도 체크 해제
   * (폴더는 모든 하위 항목이 체크된 경우에만 체크 상태를 유지해야 함)
   */
  const handleCheckChange = (checked: boolean) => {
    setCheckedNodes((prev) => {
      const next = new Set(prev);

      if (checked) {
        // 체크: 모든 대상 경로 추가
        for (const path of descendantPaths) {
          next.add(path);
        }
      } else {
        // 체크 해제: 모든 대상 경로 제거
        for (const path of descendantPaths) {
          next.delete(path);
        }
        // 상위 폴더들도 체크 해제 (하위 항목이 체크 해제되면 폴더도 체크 해제)
        const ancestorPaths = getAncestorPaths(activeKey);
        for (const ancestorPath of ancestorPaths) {
          next.delete(ancestorPath);
        }
      }

      return next;
    });
  };

  return (
    <Checkbox
      size="small"
      checked={isChecked}
      indeterminate={isIndeterminate}
      onChange={(e) => handleCheckChange(e.target.checked)}
    />
  );
}
