"use client";

import { useAtom } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { workloadFileCheckedNodesAtom } from "@/domain/workload/state/workload.atom";
import type { FileCheckboxProps } from "@/shared/components/tree/custom-file-tree";
import {
  collectAllDescendantPaths,
  getAncestorPaths,
} from "@/shared/state/filetree.atom";

export function WorkloadFileCheckbox({
  activeKey,
  type,
  node,
}: FileCheckboxProps) {
  const [checkedNodes, setCheckedNodes] = useAtom(workloadFileCheckedNodesAtom);

  // 트리 순회가 필요하므로 useMemo 유지
  const descendantPaths = useMemo(() => {
    if (type === "directory") {
      return collectAllDescendantPaths(node);
    }
    return [activeKey];
  }, [type, node, activeKey]);

  const childPaths = descendantPaths.filter((p) => p !== activeKey);

  // 해당 노드가 명시적으로 체크되었는지만 확인
  // (자식이 모두 체크되어도 부모가 명시적으로 체크되지 않았다면 체크 표시 안 함)
  const isChecked = checkedNodes.has(activeKey);

  // 디렉토리가 체크되지 않았는데 자식 중 하나라도 체크된 경우 indeterminate
  const isIndeterminate = (() => {
    if (type === "file") return false;
    if (childPaths.length === 0) return false;
    // 이미 체크된 상태면 indeterminate 아님
    if (checkedNodes.has(activeKey)) return false;
    // 자식 중 하나라도 체크되었는지 확인
    return childPaths.some((path) => checkedNodes.has(path));
  })();

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
