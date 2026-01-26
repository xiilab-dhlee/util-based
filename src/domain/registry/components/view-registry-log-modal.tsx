"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { RegistryJobLogViewer } from "@/domain/registry/components/list/registry-job-log-viewer";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

const MODAL_HEIGHT = 600;

/** 로그 모달에 전달되는 payload 타입 */
interface RegistryJobLogPayload {
  imageTagId: number;
}

/**
 * 이미지 등록 Job 로그 모달
 *
 * COMPLETED/FAILED 상태의 종료된 Job 로그를 표시합니다.
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

  return (
    <InfoModal
      modalWidth={800}
      title="컨테이너 이미지 등록 로그"
      icon={<Icon name="Log" color="#fff" size={20} />}
      open={open}
      closable
      onClose={handleClose}
      centered
    >
      <ModalContent>
        {payload ? (
          <RegistryJobLogViewer imageTagId={payload.imageTagId} />
        ) : (
          <EmptyMessage>로그 정보를 불러올 수 없습니다.</EmptyMessage>
        )}
      </ModalContent>
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
