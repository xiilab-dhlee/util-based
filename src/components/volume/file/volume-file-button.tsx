"use client";

import { useAtom } from "jotai";

import { volumeFileSelectedKeyAtom } from "@/atoms/volume/volume-file.atom";
import { FileTreeButton } from "@/components/common/button/file-tree-button";
import type { CoreFileButton } from "@/types/common/core.model";

/**
 * VolumeFileButton 컴포넌트의 props 인터페이스
 */
interface VolumeFileButtonProps extends CoreFileButton {}

/**
 * VolumeFileButton 컴포넌트
 *
 */
export function VolumeFileButton({
  fileName,
  activeKey,
  showIcon = false,
}: VolumeFileButtonProps) {
  // 현재 선택된 노드의 전역 상태를 관리하는 atom
  const [fileSelectedKey, setFileSelectedKey] = useAtom(
    volumeFileSelectedKeyAtom,
  );

  /**
   * 버튼 클릭 핸들러
   *
   * 버튼이 클릭되면 해당 노드를 선택된 상태로 설정합니다.
   */
  const handleClick = () => {
    setFileSelectedKey(activeKey);
  };

  return (
    <FileTreeButton
      isActive={fileSelectedKey === activeKey}
      onClick={handleClick}
      icon={{
        visible: showIcon,
        name: "File",
        color: "#9DA6BC",
        size: 20,
      }}
    >
      {fileName}
    </FileTreeButton>
  );
}
