"use client";

import { useAtom } from "jotai";

import { groupSelectedIdAtom } from "@/domain/group/state/group.atom";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { GroupTreeButtonProps } from "@/shared/components/tree/group-tree-node";

/**
 * AccountButton 컴포넌트
 *
 * 그룹 트리에서 계정 노드를 표시하는 버튼입니다.
 */
export function AccountButton({ id, name }: GroupTreeButtonProps) {
  const [groupSelectedId, setGroupSelectedId] = useAtom(groupSelectedIdAtom);

  const handleClick = () => {
    setGroupSelectedId(id);
  };

  return (
    <FileTreeButton
      isActive={groupSelectedId === id}
      onClick={handleClick}
      icon={{
        visible: true,
        name: "Person",
        color: "#000",
        size: 16,
      }}
    >
      {name}
    </FileTreeButton>
  );
}
