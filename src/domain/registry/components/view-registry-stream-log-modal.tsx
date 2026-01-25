"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, InfoModal } from "xiilab-ui";

import { RegistryJobStreamLogViewer } from "@/domain/registry/components/list/registry-job-stream-log-viewer";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/** 스트리밍 로그 모달에 전달되는 payload 타입 */
interface RegistryStreamLogPayload {
  imageTagId: number;
}

/**
 * 이미지 등록 Job 실시간 스트리밍 로그 모달
 *
 * IN_PROGRESS 상태의 Job 로그를 SSE로 실시간 스트리밍합니다.
 */
export function ViewRegistryStreamLogModal() {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<RegistryStreamLogPayload | null>(null);

  useSubscribe<RegistryStreamLogPayload>(
    REGISTRY_EVENTS.openStreamLogModal,
    (data) => {
      setPayload(data);
      setOpen(true);
    },
  );

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <InfoModal
      modalWidth={800}
      title="컨테이너 이미지 등록 실시간 로그"
      icon={<Icon name="Log" color="#fff" size={20} />}
      open={open}
      closable
      onClose={handleClose}
      centered
    >
      <ModalContent>
        {payload ? (
          <RegistryJobStreamLogViewer imageTagId={payload.imageTagId} />
        ) : (
          <EmptyMessage>로그 정보를 불러올 수 없습니다.</EmptyMessage>
        )}
      </ModalContent>
    </InfoModal>
  );
}

const ModalContent = styled.div`
  height: 600px;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(255, 255, 255, 0.5);
`;
