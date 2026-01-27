"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";

import { useGetWorkloadDetail } from "@/api/generated/workload/workload";
import { CompressWorkloadFileModal } from "@/domain/workload/components/file/compress-workload-file-modal";
import { CreateWorkloadFolderModal } from "@/domain/workload/components/file/create-workload-folder-modal";
import { DecompressWorkloadFileModal } from "@/domain/workload/components/file/decompress-workload-file-modal";
import { DeleteWorkloadFileModal } from "@/domain/workload/components/file/delete-workload-file-modal";
import { DownloadWorkloadFileModal } from "@/domain/workload/components/file/download-workload-file-modal";
import { UploadWorkloadFileModal } from "@/domain/workload/components/file/upload-workload-file-modal";
import { WorkloadFileBody } from "@/domain/workload/components/file/workload-file-body";
import { WorkloadFileButton } from "@/domain/workload/components/file/workload-file-button";
import { WorkloadFileFooter } from "@/domain/workload/components/file/workload-file-footer";
import { WorkloadFileHeader } from "@/domain/workload/components/file/workload-file-header";
import { useWorkloadFileTree } from "@/domain/workload/hooks/use-workload-file-tree";
import {
  workloadFileActionModeAtom,
  workloadFileCheckedNodesAtom,
  workloadFileCurrentPageAtom,
  workloadFileSelectedKeyAtom,
  workloadFileSelectedNodeInfoAtom,
  workloadFileTreeDataAtom,
  workloadSelectedPodNameAtom,
} from "@/domain/workload/state/workload.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { CustomFileTree } from "@/shared/components/tree/custom-file-tree";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

/**
 * 워크로드 파일 관리 메인 컴포넌트
 *
 * 워크로드의 파일 시스템을 관리하는 메인 컴포넌트로, 파일 트리와 파일 목록을
 * 좌우 분할 레이아웃으로 표시합니다. 파일 업로드, 다운로드, 폴더 추가 등의
 * 기능을 제공합니다.
 *
 * @returns 워크로드 파일 관리 인터페이스
 */
export function WorkloadFileMain() {
  const { id } = useParams<{ id: string }>();

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);
  const selectedPodName = useAtomValue(workloadSelectedPodNameAtom);

  const resetTreeData = useResetAtom(workloadFileTreeDataAtom);
  const resetSelectedKey = useResetAtom(workloadFileSelectedKeyAtom);
  const resetCheckedNodes = useResetAtom(workloadFileCheckedNodesAtom);
  const resetActionMode = useResetAtom(workloadFileActionModeAtom);
  const resetCurrentPage = useResetAtom(workloadFileCurrentPageAtom);
  const resetSelectedPodName = useResetAtom(workloadSelectedPodNameAtom);

  const workloadResourceName = id;
  const workspaceId = selectedWorkspace?.workspaceId ?? 0;

  // 워크로드 상세 조회 (workloadJobType 확인용)
  const { data: workloadDetail } = useGetWorkloadDetail(
    workspaceId,
    workloadResourceName,
    {
      query: {
        enabled: !!workspaceId && !!workloadResourceName,
      },
    },
  );

  const isDistributed = workloadDetail?.workloadJobType === "DISTRIBUTED";

  // 현재 워크로드의 creatorId 찾기
  const creatorId = workloadDetail?.creatorId;

  // 컴포넌트 마운트 시 파일 관련 상태 초기화
  useEffect(() => {
    resetTreeData();
    resetSelectedKey();
    resetCheckedNodes();
    resetActionMode();
    resetCurrentPage();
    resetSelectedPodName();
  }, [
    resetTreeData,
    resetSelectedKey,
    resetCheckedNodes,
    resetActionMode,
    resetCurrentPage,
    resetSelectedPodName,
  ]);

  // selectedPodName 변경 시 파일 관련 상태 초기화
  useEffect(() => {
    if (isDistributed && selectedPodName) {
      resetTreeData();
      resetSelectedKey();
      resetCheckedNodes();
      resetActionMode();
      resetCurrentPage();
    }
  }, [
    selectedPodName,
    isDistributed,
    resetTreeData,
    resetSelectedKey,
    resetCheckedNodes,
    resetActionMode,
    resetCurrentPage,
  ]);

  // 워크로드 파일 트리 훅 (선택된 노드 변경 시 자동으로 하위 파일 로드)
  const { treeData, loadingPaths, isLoading, isError } = useWorkloadFileTree({
    workspaceId,
    workloadResourceName,
    podName: isDistributed ? selectedPodName : undefined,
    enabled:
      !!workspaceId &&
      !!workloadResourceName &&
      (!isDistributed || !!selectedPodName),
  });

  /**
   * 선택된 노드에 따른 제목 텍스트 반환
   */
  const getFileTitle = () => {
    if (!selectedNode) return "전체";
    return selectedNode.type === "directory"
      ? (selectedNode.name as string)
      : "기본 정보";
  };

  /**
   * 선택된 폴더의 폴더 수와 파일 수 계산
   */
  const getFileCounts = () => {
    // 파일이 선택된 경우 카운트 표시 안함
    if (selectedNode?.type === "file") return null;

    // 전체(root) 또는 디렉토리 선택 시 children 사용
    const children = selectedNode ? selectedNode.children : treeData;

    const directoryCount = children.filter(
      (item) => item.type === "directory",
    ).length;
    const fileCount = children.filter((item) => item.type === "file").length;

    return { directoryCount, fileCount };
  };

  const fileCounts = getFileCounts();

  /**
   * 파일 트리 컨텐츠 렌더링
   */
  const renderTreeContent = () => {
    if (isLoading) return <MySpinner />;
    if (isError) return <EmptyState title={TABLE_MESSAGE.ERROR} />;
    if (treeData.length === 0) return <EmptyState title="파일이 없습니다." />;

    return (
      <CustomFileTree
        treeData={treeData}
        fileButton={WorkloadFileButton}
        loadingPaths={loadingPaths}
        isActiveRootNode
      />
    );
  };

  return (
    <>
      {/* 파일 관리 헤더 영역 */}
      <WorkloadFileHeader
        creatorId={creatorId}
        isDistributed={isDistributed}
        treeDataLength={treeData.length}
      />

      {/* 워크로드 파일 내용 - 좌우 분할 레이아웃 */}
      <FileContent>
        {/* 왼쪽: 파일 트리 영역 */}
        <Left>
          <FileContentHeader>
            <FileTitle>파일 리스트</FileTitle>
          </FileContentHeader>
          {/* 커스텀 파일 트리 컴포넌트 */}
          {renderTreeContent()}
        </Left>

        {/* 오른쪽: 파일 상세 정보 및 목록 영역 */}
        <Right>
          <FileContentHeader>
            {/* 선택된 노드에 따른 제목 표시 */}
            <FileTitle>{getFileTitle()}</FileTitle>
            {fileCounts && (
              <FileCountInfo>
                폴더 {fileCounts.directoryCount || 0}개, 파일&nbsp;
                {fileCounts.fileCount || 0}개
              </FileCountInfo>
            )}
          </FileContentHeader>
          {/* 파일 목록 본문 */}
          <WorkloadFileBody isLoading={isLoading} loadingPaths={loadingPaths} />
          {/* 파일 푸터 (페이지네이션 + 액션 버튼) */}
          <WorkloadFileFooter
            creatorId={creatorId}
            treeDataLength={treeData.length}
          />
        </Right>
      </FileContent>

      {/* 워크로드 파일 관련 모달 */}
      <CreateWorkloadFolderModal />
      {/* 워크로드 파일 삭제 모달 */}
      <DeleteWorkloadFileModal />
      {/* 워크로드 파일 다운로드 모달 */}
      <DownloadWorkloadFileModal />
      {/* 워크로드 파일 업로드 모달 */}
      <UploadWorkloadFileModal />
      {/* 워크로드 파일 압축 모달 */}
      <CompressWorkloadFileModal />
      {/* 워크로드 파일 압축 해제 모달 */}
      <DecompressWorkloadFileModal />
    </>
  );
}

const FileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
  max-height: 700px;
`;

const Left = styled.div`
  width: 334px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  padding-right: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Right = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const FileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const FileTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const FileCountInfo = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #828588;
  letter-spacing: 0;
  line-height: 1;
`;
