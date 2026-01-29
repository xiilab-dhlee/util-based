"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import type { VulnerabilityScanPolicyUpdateRequestImageType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetScanPolicyQueryKey,
  useUpdateScanPolicy,
} from "@/api/generated/vulnerability-policy-admin/vulnerability-policy-admin";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ScanPolicyConfirmPayload {
  hasEnabled: boolean;
}

interface ScanPolicyConfirmModalProps {
  /** 이미지 타입 (PUBLIC | PRIVATE) */
  imageType: VulnerabilityScanPolicyUpdateRequestImageType;
  /** 모달을 열기 위한 이벤트 이름 */
  eventName: string;
  /** 모달 제목 */
  title: string;
  /** 활성화 시 표시할 메시지 */
  enableMessage: ReactNode;
  /** 비활성화 시 표시할 메시지 */
  disableMessage: ReactNode;
}

export function ScanPolicyConfirmModal({
  imageType,
  eventName,
  title,
  enableMessage,
  disableMessage,
}: ScanPolicyConfirmModalProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(false);

  const { mutate, isPending } = useUpdateScanPolicy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetScanPolicyQueryKey(),
        });
        setOpen(false);
      },
    },
  });

  const handleConfirm = () => {
    if (isPending) return;

    mutate({
      data: {
        imageType,
        hasEnabled: pendingValue,
      },
    });
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<ScanPolicyConfirmPayload>(eventName, (payload) => {
    setPendingValue(payload.hasEnabled);
    setOpen(true);
  });

  if (pendingValue) {
    // 설정 모달
    return (
      <Modal
        type="primary"
        icon={<Icon name="Setting01" color="#fff" size={18} />}
        modalWidth={300}
        open={open}
        closable={!isPending}
        title={title}
        showCancelButton
        cancelText="취소"
        onCancel={handleCancel}
        okText="확인"
        onOk={handleConfirm}
        centered
        maskClosable={!isPending}
        keyboard={!isPending}
        okButtonProps={{
          loading: isPending,
        }}
        cancelButtonProps={{
          disabled: isPending,
        }}
      >
        <ConfirmMessage>{enableMessage}</ConfirmMessage>
      </Modal>
    );
  }

  // 해제 모달
  return (
    <Modal
      variant="error"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      closable={!isPending}
      title={title}
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="확인"
      onOk={handleConfirm}
      centered
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <ConfirmMessage>{disableMessage}</ConfirmMessage>
    </Modal>
  );
}

const ConfirmMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  text-align: left;
`;
