"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import { VulnerabilityScanPolicyUpdateRequestImageType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetScanPolicyQueryKey,
  useUpdateScanPolicy,
} from "@/api/generated/vulnerability-policy-admin/vulnerability-policy-admin";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ScanPolicyConfirmPayload {
  hasEnabled: boolean;
}

export function PublicScanPolicyConfirmModal() {
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
        imageType: VulnerabilityScanPolicyUpdateRequestImageType.PUBLIC,
        hasEnabled: pendingValue,
      },
    });
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<ScanPolicyConfirmPayload>(
    REGISTRY_EVENTS.openPublicScanPolicyConfirmModal,
    (payload) => {
      setPendingValue(payload.hasEnabled);
      setOpen(true);
    },
  );

  if (pendingValue) {
    // 설정 모달
    return (
      <Modal
        type="primary"
        icon={<Icon name="Setting01" color="#fff" size={18} />}
        modalWidth={300}
        open={open}
        closable={!isPending}
        title="공유 레지스트리 이미지 보안 검사"
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
        <ConfirmMessage>
          공유 레지스트리 이미지 보안 자동 검사를 설정하시겠습니까?
          <br />
          설정 시 업로드와 보안 검사가 함께 진행됩니다.
        </ConfirmMessage>
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
      title="공유 레지스트리 이미지 보안 검사"
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
      <ConfirmMessage>
        공유 레지스트리 이미지 보안 자동 검사를 해제하시겠습니까?
        <br />
        해제 시 보안 검사는 수동으로 진행하게 됩니다.
      </ConfirmMessage>
    </Modal>
  );
}

const ConfirmMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  text-align: left;
`;
