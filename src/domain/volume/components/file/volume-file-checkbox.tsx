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

  const isChecked = useMemo(() => {
    if (type === "file") {
      return checkedNodes.has(activeKey);
    }
    if (childPaths.length === 0) {
      return checkedNodes.has(activeKey);
    }
    return childPaths.every((path) => checkedNodes.has(path));
  }, [type, activeKey, childPaths, checkedNodes]);

  const isIndeterminate = useMemo(() => {
    if (type === "file") return false;
    if (childPaths.length === 0) return false;
    const checkedCount = childPaths.filter((path) =>
      checkedNodes.has(path),
    ).length;
    return checkedCount > 0 && checkedCount < childPaths.length;
  }, [type, childPaths, checkedNodes]);

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
