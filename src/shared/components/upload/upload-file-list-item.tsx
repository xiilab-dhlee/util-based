"use client";

import { Progress } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { formatFileSize } from "@/shared/utils/file.util";

// ============================================================================
// Types
// ============================================================================

export type UploadFileStatus =
  | "pending"
  | "uploading"
  | "completed"
  | "error"
  | "cancelled";

export interface UploadFileItem {
  id: string;
  name: string;
  size: number;
  status: UploadFileStatus;
  progress: number;
  error?: string;
}

export interface UploadFileListItemProps {
  file: UploadFileItem;
  onUpload: (fileId: string) => void;
  onCancel: (fileId: string) => void;
  onRemove: (fileId: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

const STATUS_COLOR: Record<UploadFileStatus, string> = {
  pending: "#666",
  uploading: "#1f5bff",
  completed: "#52c41a",
  error: "#ff4d4f",
  cancelled: "#999",
};

// ============================================================================
// Styled Components
// ============================================================================

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e5f0;
  gap: 8px;

  &:last-child {
    border-bottom: none;
  }
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 13px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileSize = styled.div`
  font-size: 11px;
  color: #999;
`;

const FileStatus = styled.span<{ $status: UploadFileStatus }>`
  font-size: 12px;
  font-weight: 500;
  min-width: 50px;
  text-align: right;
  color: ${({ $status }) => STATUS_COLOR[$status]};
`;

const ProgressWrapper = styled.div`
  width: 100px;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 56px;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

// ============================================================================
// Component
// ============================================================================

export function UploadFileListItem({
  file,
  onUpload,
  onCancel,
  onRemove,
}: UploadFileListItemProps) {
  const isPending = file.status === "pending";
  const isUploading = file.status === "uploading";
  const isCompleted = file.status === "completed";
  const isError = file.status === "error";

  return (
    <FileItem>
      <FileInfo>
        <FileName>{file.name}</FileName>
        <FileSize>{formatFileSize(file.size).formatted}</FileSize>
      </FileInfo>
      <StatusRenderer
        status={file.status}
        progress={file.progress}
        error={file.error}
        isUploading={isUploading}
        isCompleted={isCompleted}
        isError={isError}
        isPending={isPending}
      />
      <ActionButtons>
        <ActionsRenderer
          fileId={file.id}
          isPending={isPending}
          isUploading={isUploading}
          isError={isError}
          onUpload={onUpload}
          onCancel={onCancel}
          onRemove={onRemove}
        />
      </ActionButtons>
    </FileItem>
  );
}

// ============================================================================
// Sub Components
// ============================================================================

interface StatusRendererProps {
  status: UploadFileStatus;
  progress: number;
  error?: string;
  isUploading: boolean;
  isCompleted: boolean;
  isError: boolean;
  isPending: boolean;
}

function StatusRenderer({
  status,
  progress,
  error,
  isUploading,
  isCompleted,
  isError,
  isPending,
}: StatusRendererProps): ReactNode {
  // 업로드 중 또는 완료: progress bar 표시
  if (isUploading || isCompleted) {
    return (
      <ProgressWrapper>
        <Progress
          percent={progress}
          size="small"
          showInfo={false}
          status={isCompleted ? "success" : "active"}
        />
      </ProgressWrapper>
    );
  }

  // 오류: 에러 메시지 표시
  if (isError) {
    return <FileStatus $status="error">{error ?? "오류"}</FileStatus>;
  }

  // 대기 중: 상태 텍스트 표시
  if (isPending) {
    return <FileStatus $status="pending">대기 중</FileStatus>;
  }

  // 취소됨
  return <FileStatus $status={status}>취소됨</FileStatus>;
}

interface ActionsRendererProps {
  fileId: string;
  isPending: boolean;
  isUploading: boolean;
  isError: boolean;
  onUpload: (fileId: string) => void;
  onCancel: (fileId: string) => void;
  onRemove: (fileId: string) => void;
}

function ActionsRenderer({
  fileId,
  isPending,
  isUploading,
  isError,
  onUpload,
  onCancel,
  onRemove,
}: ActionsRendererProps): ReactNode {
  // 업로드 중: 취소 버튼만
  if (isUploading) {
    return (
      <ActionButton
        type="button"
        onClick={() => onCancel(fileId)}
        title="업로드 취소"
      >
        <Icon name="Close" size={14} color="#ff4d4f" />
      </ActionButton>
    );
  }

  // 대기 중: 업로드 버튼 + 삭제 버튼
  if (isPending) {
    return (
      <>
        <ActionButton
          type="button"
          onClick={() => onUpload(fileId)}
          title="업로드"
        >
          <Icon name="Upload" size={14} color="#000" />
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => onRemove(fileId)}
          title="삭제"
        >
          <Icon name="Close" size={14} color="#000" />
        </ActionButton>
      </>
    );
  }

  // 오류: 재시도 버튼 + 삭제 버튼
  if (isError) {
    return (
      <>
        <ActionButton
          type="button"
          onClick={() => onUpload(fileId)}
          title="재시도"
        >
          <RefreshIcon width={20} height={20} fill="#000" />
        </ActionButton>
        <ActionButton
          type="button"
          onClick={() => onRemove(fileId)}
          title="삭제"
        >
          <Icon name="Close" size={14} color="#000" />
        </ActionButton>
      </>
    );
  }

  // 완료: 아무 버튼 없음
  return null;
}
