"use client";

import { useAtom } from "jotai";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { volumeFileSelectedKeyAtom } from "@/domain/volume/state/volume.atom";
import { FileTreeButton } from "@/shared/components/button/file-tree-button";
import type { CoreFileButton } from "@/shared/types/core.model";

interface VolumeFileButtonProps extends CoreFileButton {}

export function VolumeFileButton({
  fileName,
  activeKey,
  showIcon = false,
  path,
  type,
}: VolumeFileButtonProps) {
  const [fileSelectedKey, setFileSelectedKey] = useAtom(
    volumeFileSelectedKeyAtom,
  );

  const handleClick = () => {
    setFileSelectedKey(activeKey);
  };

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
          <span className="sr-only">경로 복사</span>
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
    background 0.2s,
    outline 0.2s;

  ${Container}:hover &,
  ${Container}:focus-within & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }

  &:focus-visible {
    opacity: 1;
    outline: 2px solid #1f5bff;
    outline-offset: 1px;
    background: rgba(0, 0, 0, 0.04);
  }

  ${Container}.active &:hover,
  ${Container}.active &:focus-visible {
    background: rgba(31, 91, 255, 0.1);
  }
`;
