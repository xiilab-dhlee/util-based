"use client";

import { useAtom } from "jotai";

import { groupSelectedKeyAtom } from "@/domain/group/state/group.atom";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { CoreFileButton } from "@/shared/types/core.model";

/**
 * GroupButton 컴포넌트의 props 인터페이스
 */
interface GroupButtonProps extends CoreFileButton {}

/**
 * GroupButton 컴포넌트
 *
 */
export function GroupButton({
  fileName,
  activeKey,
  showIcon = false,
}: GroupButtonProps) {
  // 현재 선택된 노드의 전역 상태를 관리하는 atom
  const [groupSelectedKey, setGroupSelectedKey] = useAtom(groupSelectedKeyAtom);

  /**
   * 버튼 클릭 핸들러
   *
   * 버튼이 클릭되면 해당 노드를 선택된 상태로 설정합니다.
   */
  const handleClick = () => {
    setGroupSelectedKey(activeKey);
  };

  return (
    <FileTreeButton
      isActive={groupSelectedKey === activeKey}
      onClick={handleClick}
      icon={{
        visible: showIcon,
        name: "Person",
        color: "#000",
        size: 16,
      }}
    >
      {fileName}
    </FileTreeButton>
  );
}
