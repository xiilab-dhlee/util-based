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

export function VolumeFileCheckbox({
  activeKey,
  type,
  node,
}: FileCheckboxProps) {
  const [checkedNodes, setCheckedNodes] = useAtom(volumeFileCheckedNodesAtom);

  const descendantPaths = useMemo(() => {
    if (type === "directory") {
      return collectAllDescendantPaths(node);
    }
    return [activeKey];
  }, [type, node, activeKey]);

  const childPaths = useMemo(() => {
    return descendantPaths.filter((p) => p !== activeKey);
  }, [descendantPaths, activeKey]);

  // 해당 노드가 명시적으로 체크되었는지만 확인
  // (자식이 모두 체크되어도 부모가 명시적으로 체크되지 않았다면 체크 표시 안 함)
  const isChecked = useMemo(() => {
    return checkedNodes.has(activeKey);
  }, [activeKey, checkedNodes]);

  // 디렉토리가 체크되지 않았는데 자식 중 하나라도 체크된 경우 indeterminate
  const isIndeterminate = useMemo(() => {
    if (type === "file") return false;
    if (childPaths.length === 0) return false;
    // 이미 체크된 상태면 indeterminate 아님
    if (checkedNodes.has(activeKey)) return false;
    // 자식 중 하나라도 체크되었는지 확인
    return childPaths.some((path) => checkedNodes.has(path));
  }, [type, activeKey, childPaths, checkedNodes]);

  const handleCheckChange = (checked: boolean) => {
    setCheckedNodes((prev) => {
      const next = new Set(prev);

      if (checked) {
        for (const path of descendantPaths) {
          next.add(path);
        }
      } else {
        for (const path of descendantPaths) {
          next.delete(path);
        }
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
