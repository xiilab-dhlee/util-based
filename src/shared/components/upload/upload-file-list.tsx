"use client";

import styled from "styled-components";

import { UploadFileListItem } from "@/shared/components/upload/upload-file-list-item";
import type { UploadFileItem } from "@/shared/types/upload.type";
import { customScrollbar } from "@/styles/mixins/scrollbar";

// ============================================================================
// Types
// ============================================================================

export interface UploadFileListProps {
  files: UploadFileItem[];
  totalProgress: number;
  isUploading: boolean;
  onRemove: (fileId: string) => void;
}

// ============================================================================
// Styled Components
// ============================================================================

const FileListContainer = styled.div`
  margin-top: 16px;
`;

const FileListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const ProgressText = styled.span`
  color: #1f5bff;
  font-weight: 600;
`;

const FileList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e0e5f0;
  border-radius: 4px;

  ${customScrollbar()}
`;

// ============================================================================
// Component
// ============================================================================

export function UploadFileList({
  files,
  totalProgress,
  isUploading,
  onRemove,
}: UploadFileListProps) {
  return (
    <FileListContainer>
      <FileListHeader>
        <span>선택된 파일 ({files.length}개)</span>
        {isUploading && (
          <ProgressText>전체 진행률: {Math.round(totalProgress)}%</ProgressText>
        )}
      </FileListHeader>
      <FileList>
        {files.map((file) => (
          <UploadFileListItem key={file.id} file={file} onRemove={onRemove} />
        ))}
      </FileList>
    </FileListContainer>
  );
}
