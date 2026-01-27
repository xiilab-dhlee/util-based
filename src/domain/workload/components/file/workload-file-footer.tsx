"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";
import { Button, Pagination } from "xiilab-ui";

import { WORKLOAD_FILE_PAGE_SIZE } from "@/domain/workload/constants/workload-file.constant";
import { useWorkloadFilePermissions } from "@/domain/workload/hooks/use-workload-file-permissions";
import {
  type FileActionMode,
  workloadFileActionModeAtom,
  workloadFileCheckedNodesAtom,
  workloadFileCurrentPageAtom,
  workloadFileSelectedNodeInfoAtom,
  workloadSelectedPodNameAtom,
} from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { isCompressedFile } from "@/shared/utils/filetree.util";

/** 액션 모드별 라벨 */
const ACTION_MODE_LABELS: Record<Exclude<FileActionMode, null>, string> = {
  delete: "삭제",
  compress: "압축",
  download: "다운로드",
};

/** 액션 모드별 이벤트 매핑 */
const ACTION_EVENT_MAP: Record<Exclude<FileActionMode, null>, string> = {
  delete: WORKLOAD_EVENTS.openDeleteFileModal,
  compress: WORKLOAD_EVENTS.openCompressFileModal,
  download: WORKLOAD_EVENTS.openDownloadFileModal,
};

interface WorkloadFileFooterProps {
  /** 워크로드 생성자 ID */
  creatorId?: string;
  /** 트리 데이터 길이 (totalFiles 계산용) */
  treeDataLength: number;
}

/**
 * 워크로드 파일 푸터 컴포넌트
 *
 * 페이지네이션과 파일 액션 버튼(삭제, 압축, 압축해제, 다운로드)을 포함합니다.
 */
export function WorkloadFileFooter({
  creatorId,
  treeDataLength,
}: WorkloadFileFooterProps) {
  const { id } = useParams<{ id: string }>();
  const publish = usePublish();

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);
  const selectedPodName = useAtomValue(workloadSelectedPodNameAtom);

  const [actionMode, setActionMode] = useAtom(workloadFileActionModeAtom);
  const setCheckedNodes = useSetAtom(workloadFileCheckedNodesAtom);
  const [currentPage, setCurrentPage] = useAtom(workloadFileCurrentPageAtom);

  const workspaceId = selectedWorkspace?.workspaceId ?? 0;
  const workloadResourceName = id;

  // 권한 확인
  const { canManageFiles, checkedNodesInfo } = useWorkloadFilePermissions({
    creatorId,
    treeDataLength,
  });

  // 현재 표시할 파일 총 개수
  const totalFiles = selectedNode
    ? selectedNode.children.length
    : treeDataLength;

  // 선택된 노드가 변경되면 페이지를 1로 리셋
  const selectedNodePath = selectedNode?.path;
  // biome-ignore lint/correctness/useExhaustiveDependencies: selectedNodePath 변경 시에만 리셋 필요
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedNodePath, setCurrentPage]);

  // 압축 해제 가능 여부: 선택된 노드가 파일이고 압축 파일인 경우
  const canDecompressSelected =
    selectedNode?.type === "file" && isCompressedFile(selectedNode.path);

  /**
   * 액션 버튼 클릭 핸들러
   * - 파일 선택 시: 즉시 해당 파일에 대한 작업 수행
   * - 폴더/전체 선택 시: 액션 모드로 진입 (체크박스 표시)
   */
  const handleActionClick = (mode: Exclude<FileActionMode, null>) => {
    // 파일이 선택된 경우 즉시 해당 파일에 대한 작업 수행
    if (selectedNode?.type === "file") {
      publish(ACTION_EVENT_MAP[mode], {
        workspaceId,
        workloadResourceName,
        filePaths: [selectedNode.path],
        podName: selectedPodName,
      });
      return;
    }

    // 폴더 또는 전체 선택 시 액션 모드로 진입
    setCheckedNodes(new Set()); // 체크 상태 초기화
    setActionMode(mode);
  };

  /**
   * 액션 모드 취소 핸들러
   */
  const handleCancelActionMode = () => {
    setCheckedNodes(new Set()); // 체크 상태 초기화
    setActionMode(null);
  };

  /**
   * 선택 액션 확인 핸들러
   */
  const handleConfirmAction = () => {
    if (checkedNodesInfo.length === 0 || actionMode === null) return;

    publish(ACTION_EVENT_MAP[actionMode], {
      workspaceId,
      workloadResourceName,
      filePaths: checkedNodesInfo.map((node) => node.path),
      podName: selectedPodName,
    });

    // 액션 완료 후 모드 초기화
    handleCancelActionMode();
  };

  /**
   * 압축 해제 버튼 클릭 핸들러
   */
  const handleDecompress = () => {
    if (selectedNode?.path) {
      publish(WORKLOAD_EVENTS.openDecompressFileModal, {
        workspaceId,
        workloadResourceName,
        filePath: selectedNode.path,
        podName: selectedPodName,
      });
    }
  };

  return (
    <FooterContainer>
      <FooterLeft />
      {selectedNode?.type !== "file" && (
        <FooterCenter>
          <Pagination
            current={currentPage}
            total={totalFiles}
            pageSize={WORKLOAD_FILE_PAGE_SIZE}
            onChange={setCurrentPage}
          />
        </FooterCenter>
      )}
      <FooterRight>
        {canManageFiles &&
          (actionMode === null ? (
            // 기본 모드: 액션 버튼들
            <>
              <Button
                variant="outlined"
                width={80}
                height={30}
                onClick={() => handleActionClick("delete")}
              >
                삭제
              </Button>
              <Button
                variant="outlined"
                width={80}
                height={30}
                onClick={() => handleActionClick("compress")}
              >
                압축
              </Button>
              {canDecompressSelected && (
                <Button
                  variant="outlined"
                  width={80}
                  height={30}
                  onClick={handleDecompress}
                >
                  압축 해제
                </Button>
              )}
              <Button
                variant="outlined"
                width={80}
                height={30}
                onClick={() => handleActionClick("download")}
              >
                다운로드
              </Button>
            </>
          ) : (
            // 액션 모드: 취소 + 선택 액션 버튼
            <>
              <Button
                variant="outlined"
                width={80}
                height={30}
                onClick={handleCancelActionMode}
              >
                취소
              </Button>
              <Button
                variant="outlined"
                width={100}
                height={30}
                onClick={handleConfirmAction}
                disabled={checkedNodesInfo.length === 0}
              >
                선택 {ACTION_MODE_LABELS[actionMode]}
              </Button>
            </>
          ))}
      </FooterRight>
    </FooterContainer>
  );
}

const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  flex-shrink: 0;
`;

const FooterLeft = styled.div`
  flex: 1;
`;

const FooterCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FooterRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
