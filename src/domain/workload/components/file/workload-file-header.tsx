"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { Button } from "xiilab-ui";

import { PodSelect } from "@/domain/workload/components/pod-select";
import { useWorkloadFilePermissions } from "@/domain/workload/hooks/use-workload-file-permissions";
import {
  workloadFileSelectedNodeInfoAtom,
  workloadSelectedPodNameAtom,
} from "@/domain/workload/state/workload.atom";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import {
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";

interface WorkloadFileHeaderProps {
  /** 워크로드 생성자 ID */
  creatorId?: string;
  /** 분산 워크로드 여부 (API 중복 호출 방지를 위해 props로 전달) */
  isDistributed: boolean;
  /** 트리 데이터 길이 (canCreateFolder 계산용) */
  treeDataLength: number;
}

/**
 * 워크로드 파일 헤더 컴포넌트
 *
 * 파일 목록 제목과 Pod 선택, 폴더 추가, 파일 업로드 버튼을 포함합니다.
 */
export function WorkloadFileHeader({
  creatorId,
  isDistributed,
  treeDataLength,
}: WorkloadFileHeaderProps) {
  const { id } = useParams<{ id: string }>();
  const publish = usePublish();

  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);
  const [selectedPodName, setSelectedPodName] = useAtom(
    workloadSelectedPodNameAtom,
  );

  const workspaceId = selectedWorkspace?.workspaceId ?? 0;
  const workloadResourceName = id;

  // 권한 확인
  const { canCreateFolder, canUpload } = useWorkloadFilePermissions({
    creatorId,
    treeDataLength,
  });

  /**
   * 폴더 추가 버튼 클릭 핸들러
   */
  const handleAddFolder = () => {
    publish(WORKLOAD_EVENTS.openCreateFolderModal, {
      workspaceId,
      workloadResourceName,
      filePath: selectedNode?.path || "/",
    });
  };

  /**
   * 파일 업로드 버튼 클릭 핸들러
   */
  const handleUpload = () => {
    publish(WORKLOAD_EVENTS.openUploadFileModal, {
      workspaceId,
      workloadResourceName,
      podName: isDistributed ? selectedPodName : undefined,
    });
  };

  return (
    <DetailContentHeader>
      <DetailContentTitle>파일목록</DetailContentTitle>
      <DetailContentTitleTool>
        {isDistributed && (
          <PodSelect
            workspaceId={workspaceId}
            workloadResourceName={workloadResourceName}
            value={selectedPodName}
            setValue={setSelectedPodName}
          />
        )}
        {canCreateFolder && (
          <Button
            variant="outlined"
            width={80}
            height={30}
            onClick={handleAddFolder}
          >
            폴더 추가
          </Button>
        )}
        {canUpload && (
          <Button
            variant="outlined"
            width={90}
            height={30}
            onClick={handleUpload}
          >
            파일 업로드
          </Button>
        )}
      </DetailContentTitleTool>
    </DetailContentHeader>
  );
}
