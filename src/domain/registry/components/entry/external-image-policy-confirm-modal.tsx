"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import {
  getGetAstragoOnlyPolicyQueryKey,
  useUpdateAstragoOnlyPolicy,
} from "@/api/generated/vulnerability-policy-admin/vulnerability-policy-admin";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ExternalImagePolicyConfirmPayload {
  /** true: 외부 이미지 사용 허용 (astragoOnly = false), false: 외부 이미지 사용 제한 (astragoOnly = true) */
  allowExternalImage: boolean;
}

export function ExternalImagePolicyConfirmModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  // true: 외부 이미지 허용, false: 외부 이미지 제한
  const [allowExternalImage, setAllowExternalImage] = useState(false);

  const { mutate, isPending } = useUpdateAstragoOnlyPolicy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetAstragoOnlyPolicyQueryKey(),
        });
        setOpen(false);
      },
    },
  });

  const handleConfirm = () => {
    if (isPending) return;

    // allowExternalImage = true → astragoOnly = false (외부 허용)
    // allowExternalImage = false → astragoOnly = true (외부 제한)
    mutate({
      data: {
        hasEnabled: !allowExternalImage,
      },
    });
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<ExternalImagePolicyConfirmPayload>(
    REGISTRY_EVENTS.openExternalImagePolicyConfirmModal,
    (payload) => {
      setAllowExternalImage(payload.allowExternalImage);
      setOpen(true);
    },
  );

  if (allowExternalImage) {
    // 허용 모달 (파란색)
    return (
      <Modal
        type="primary"
        icon={<Icon name="Setting01" color="#fff" size={18} />}
        modalWidth={300}
        open={open}
        closable={!isPending}
        title="외부 업로드 이미지 사용 허용"
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
          외부 업로드 이미지 사용을 허용하시겠습니까?
          <br />
          허용 시 외부 레지스트리의 이미지를 사용할 수 있습니다.
        </ConfirmMessage>
      </Modal>
    );
  }

  // 제한 모달 (빨간색)
  return (
    <Modal
      variant="error"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      closable={!isPending}
      title="외부 업로드 이미지 사용 제한"
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
        외부 업로드 이미지 사용을 제한하시겠습니까?
        <br />
        제한 시 AstraGo를 통해 등록된 이미지만 사용할 수 있습니다.
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
