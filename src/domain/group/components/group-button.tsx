"use client";

import { useAtom } from "jotai";

import { groupSelectedIdAtom } from "@/domain/group/state/group.atom";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { GroupTreeButtonProps } from "@/shared/components/tree/group-tree-node";

/**
 * GroupButton 컴포넌트
 *
 * 그룹 트리에서 그룹 노드를 표시하는 버튼입니다.
 */
export function GroupButton({ id, name }: GroupTreeButtonProps) {
  const [groupSelectedId, setGroupSelectedId] = useAtom(groupSelectedIdAtom);

  const handleClick = () => {
    setGroupSelectedId(id);
  };

  return (
    <FileTreeButton isActive={groupSelectedId === id} onClick={handleClick}>
      {name}
    </FileTreeButton>
  );
}
