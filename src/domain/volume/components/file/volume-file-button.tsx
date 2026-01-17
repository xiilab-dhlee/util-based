"use client";

import { useAtom } from "jotai";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { volumeFileSelectedKeyAtom } from "@/domain/volume/state/volume.atom";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { CoreFileButton } from "@/shared/types/core.model";

/**
 * VolumeFileButton 컴포넌트의 props 인터페이스
 */
interface VolumeFileButtonProps extends CoreFileButton {}

/**
 * VolumeFileButton 컴포넌트
 *
 * 볼륨 파일 트리에서 파일/폴더를 선택하는 버튼입니다.
 * 폴더인 경우 경로 복사 아이콘이 표시됩니다.
 */
export function VolumeFileButton({
  fileName,
  activeKey,
  showIcon = false,
  path,
  type,
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

  /**
   * 경로 복사 핸들러
   *
   * 폴더 경로를 클립보드에 복사합니다.
   */
  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!path) return;

    try {
      await navigator.clipboard.writeText(path);
      toast.success("경로가 클립보드에 복사되었습니다.");
    } catch {
      toast.error("경로 복사에 실패했습니다.");
    }
  };

  const isDirectory = type === "directory";
  const isActive = fileSelectedKey === activeKey;

  return (
    <Container className={isActive ? "active" : ""}>
      <FileTreeButton
        isActive={isActive}
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
      {isDirectory && path && (
        <CopyButton type="button" onClick={handleCopyPath} title="경로 복사">
          <Icon name="Copy" color="var(--copy-icon-color)" size={16} />
        </CopyButton>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  border-radius: 2px;
  --copy-icon-color: #9da6bc;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &.active {
    background: #eef4ff;
    --copy-icon-color: #1f5bff;
  }

  /* FileTreeButton 내부 호버/active 스타일 오버라이드 (Container에서 관리) */
  & > button {
    &:hover {
      background: transparent;
    }
    &.active {
      background: transparent;
      font-weight: 600;
    }
  }
`;

const CopyButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 4px;
  opacity: 0;
  transition:
    opacity 0.2s,
    background 0.2s;

  ${Container}:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  ${Container}.active &:hover {
    background: rgba(31, 91, 255, 0.1);
  }
`;
