"use client";

import { useAtom } from "jotai";

import { workloadFileSelectedKeyAtom } from "@/atoms/workload/workload-file.atom";
import { FileTreeButton } from "@/components/common/buttons/file-tree-button";
import type { CoreFileButton } from "@/types/common/core.model";

/**
 * WorkloadFileButton 컴포넌트의 props 인터페이스
 */
interface WorkloadFileButtonProps extends CoreFileButton {}

/**
 * WorkloadFileButton 컴포넌트
 *
 */
export function WorkloadFileButton({
  fileName,
  activeKey,
  showIcon = false,
}: WorkloadFileButtonProps) {
  // 현재 선택된 노드의 전역 상태를 관리하는 atom
  const [workloadFileSelectedKey, setWorkloadFileSelectedKey] = useAtom(
    workloadFileSelectedKeyAtom,
  );

  /**
   * 버튼 클릭 핸들러
   *
   * 버튼이 클릭되면 해당 노드를 선택된 상태로 설정합니다.
   */
  const handleClick = () => {
    setWorkloadFileSelectedKey(activeKey);
  };

  return (
    <FileTreeButton
      isActive={workloadFileSelectedKey === activeKey}
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

