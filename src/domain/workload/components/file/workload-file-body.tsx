"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import styled from "styled-components";

import { useWorkloadPreviewFile } from "@/api/generated/workload/workload";
import { WorkloadFileCard } from "@/domain/workload/components/file/workload-file-card";
import { WorkloadFilePreview } from "@/domain/workload/components/file/workload-file-preview";
import { WORKLOAD_FILE_PAGE_SIZE } from "@/domain/workload/constants/workload-file.constant";
import {
  workloadFileActionModeAtom,
  workloadFileCurrentPageAtom,
  workloadFileSelectedNodeInfoAtom,
  workloadFileTreeDataAtom,
  workloadSelectedPodNameAtom,
} from "@/domain/workload/state/workload.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { formatFileSize, getPreviewType } from "@/shared/utils/file.util";
import { DetailContentKey } from "@/styles/layers/detail-page-layers.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface WorkloadFileBodyProps {
  /** 루트 로딩 상태 */
  isLoading?: boolean;
  /** 개별 폴더 로딩 상태 (path 기준) */
  loadingPaths?: Set<string>;
}

/**
 * 워크로드 파일 본문 컴포넌트
 *
 * 워크로드 파일 트리에서 파일/디렉토리 목록을 표시하는 컴포넌트입니다.
 */
export function WorkloadFileBody({
  isLoading = false,
  loadingPaths = new Set(),
}: WorkloadFileBodyProps) {
  // ============================================
  // 전역 상태
  // ============================================
  const { id: workloadResourceName } = useParams<{ id: string }>();
  const treeData = useAtomValue(workloadFileTreeDataAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const selectedPodName = useAtomValue(workloadSelectedPodNameAtom);
  const actionMode = useAtomValue(workloadFileActionModeAtom);
  const currentPage = useAtomValue(workloadFileCurrentPageAtom);

  const workspaceId = selectedWorkspace?.workspaceId ?? 0;

  // ============================================
  // 노드 타입 판별
  // ============================================
  const isRootView = selectedNode === null;
  const isFileView = selectedNode?.type === "file";
  const isDirectoryView = selectedNode?.type === "directory";

  // ============================================
  // 빈 상태 판별
  // ============================================
  const isRootEmpty = isRootView && treeData.length === 0;
  const isDirectoryEmpty =
    isDirectoryView && selectedNode.children.length === 0;

  // ============================================
  // 로딩 상태 판별
  // ============================================
  const isSelectedNodeLoading = selectedNode?.path
    ? loadingPaths.has(selectedNode.path)
    : false;
  const showLoading = isLoading || isSelectedNodeLoading;

  // ============================================
  // 파일 목록 (페이지네이션)
  // ============================================
  const allFiles = isRootView ? treeData : (selectedNode?.children ?? []);
  const startIndex = (currentPage - 1) * WORKLOAD_FILE_PAGE_SIZE;
  const paginatedFiles = allFiles.slice(
    startIndex,
    startIndex + WORKLOAD_FILE_PAGE_SIZE,
  );

  // ============================================
  // 파일 미리보기
  // ============================================
  const previewType = isFileView
    ? getPreviewType(selectedNode.fileExtension)
    : null;
  const canPreview = isFileView && previewType !== null;

  const { data: previewData, isLoading: isPreviewLoading } =
    useWorkloadPreviewFile(
      workspaceId,
      workloadResourceName,
      {
        path: selectedNode?.path ?? "",
        podName: selectedPodName || undefined,
      },
      {
        query: {
          enabled:
            canPreview &&
            !!workspaceId &&
            !!workloadResourceName &&
            !!selectedNode?.path,
        },
      },
    );

  // ============================================
  // 렌더링: 로딩
  // ============================================
  if (showLoading) {
    return (
      <ListWrapper>
        <LoadingWrapper>
          <MySpinner />
        </LoadingWrapper>
      </ListWrapper>
    );
  }

  // ============================================
  // 렌더링: 메인
  // ============================================
  return (
    <StyledListWrapper>
      {/* 파일/폴더 그리드 */}
      <FileGridWrapper>
        {paginatedFiles.map((file) => (
          <WorkloadFileCard
            key={file.path}
            {...file}
            showCheckbox={actionMode !== null}
          />
        ))}
      </FileGridWrapper>

      {/* 파일 상세 정보 (파일 선택 시) */}
      {selectedNode?.type === "file" && (
        <FileInfoContainer>
          <KeyValueContainer>
            <DetailContentKey>파일 이름</DetailContentKey>
            <Value>{selectedNode.name}</Value>
          </KeyValueContainer>
          <KeyValueContainer>
            <DetailContentKey>파일 용량</DetailContentKey>
            <Value>
              {formatFileSize(Number(selectedNode.fileSize) || 0).formatted}
            </Value>
          </KeyValueContainer>
          <KeyValueContainer>
            <DetailContentKey>미리 보기</DetailContentKey>
            <WorkloadFilePreview
              previewType={previewType}
              previewData={previewData}
              isLoading={isPreviewLoading}
              fileName={selectedNode.name}
              fileExtension={selectedNode.fileExtension}
            />
          </KeyValueContainer>
        </FileInfoContainer>
      )}

      {/* 빈 상태 */}
      {isRootEmpty && <EmptyState title="파일이 없습니다" />}
      {isDirectoryEmpty && <EmptyState title="선택한 폴더에 파일이 없습니다" />}
    </StyledListWrapper>
  );
}

const StyledListWrapper = styled(ListWrapper)`
  overflow: auto;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const FileGridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const FileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const KeyValueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 34px;
`;

const Value = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #000;
  font-size: 14px;
  font-weight: 400;
`;
