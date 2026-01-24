"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { RegistryJobLogViewer } from "@/domain/registry/components/list/registry-job-log-viewer";
import { RegistryJobStreamLogViewer } from "@/domain/registry/components/list/registry-job-stream-log-viewer";
import { IMAGE_JOB_STATUS } from "@/domain/registry/constants/registry-list.constant";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

const MODAL_HEIGHT = 600;

/** 로그 모달에 전달되는 payload 타입 */
interface RegistryJobLogPayload {
  imageTagId: number;
  status: string;
}

/**
 * 이미지 등록 Job 로그 모달
 *
 * - IN_PROGRESS: 실시간 스트리밍 로그 (SSE)
 * - COMPLETED/FAILED: 종료된 Job 로그
 */
export function ViewRegistryJobLogModal() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<RegistryJobLogPayload | null>(null);

  useSubscribe<RegistryJobLogPayload>(REGISTRY_EVENTS.openLogModal, (data) => {
    setPayload(data);
    setOpen(true);
  });

  const handleClose = () => {
    setOpen(false);
    setPayload(null);
  };

  const isStreaming = payload?.status === IMAGE_JOB_STATUS.IN_PROGRESS;
  const modalTitle = `컨테이너 이미지 등록 ${isStreaming ? "실시간 로그" : "로그"}`;

  const renderLogViewer = () => {
    if (!payload) {
      return <EmptyMessage>로그 정보를 불러올 수 없습니다.</EmptyMessage>;
    }

    if (isStreaming) {
      return <RegistryJobStreamLogViewer imageTagId={payload.imageTagId} />;
    }

    return <RegistryJobLogViewer imageTagId={payload.imageTagId} />;
  };

  return (
    <InfoModal
      modalWidth={800}
      title={modalTitle}
      icon={<Icon name="Log" color="#fff" size={20} />}
      open={open}
      closable
      onClose={handleClose}
      centered
    >
      <ModalContent>{renderLogViewer()}</ModalContent>
    </InfoModal>
  );
}

const ModalContent = styled.div`
  height: ${MODAL_HEIGHT}px;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
`;
