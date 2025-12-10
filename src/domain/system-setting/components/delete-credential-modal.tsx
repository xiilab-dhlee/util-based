"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Modal } from "xiilab-ui";

import type { CredentialIdType } from "@/domain/credential/schemas/credential.schema";
import { useDeleteCredential } from "@/domain/system-setting/hooks/use-delete-credential";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface DeleteCredentialModalPayload {
  id: CredentialIdType;
}

/**
 * 크레덴셜 삭제 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 크레덴셜 ID를 전달받습니다.
 */
export function DeleteCredentialModal() {
  const [open, setOpen] = useState(false);
  const [credentialId, setCredentialId] = useState<CredentialIdType | null>(
    null,
  );

  const deleteCredential = useDeleteCredential();

  // PubSub 구독 - 크레덴셜 삭제 모달 열기 이벤트
  useSubscribe<DeleteCredentialModalPayload>(
    SYSTEM_SETTING_EVENTS.openCredentialDeleteModal,
    useCallback((payload) => {
      setCredentialId(payload.id);
      setOpen(true);
    }, []),
  );

  const handleCancel = () => {
    setOpen(false);
    setCredentialId(null);
  };

  const handleDelete = () => {
    if (credentialId === null) return;

    deleteCredential.mutate(credentialId, {
      onSuccess: handleCancel,
    });
  };

  if (!open) return null;

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      title="크레덴셜 삭제"
      centered
      okButtonProps={{
        loading: deleteCredential.isPending,
      }}
    >
      <MessageContainer>
        <Message>
          선택된 크레덴셜을 삭제하시겠습니까? <br /> 크레덴셜 삭제 시 복구되지
          않습니다.
        </Message>
      </MessageContainer>
    </Modal>
  );
}

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Message = styled.div`
  font-size: 12px;
  line-height: 18px;
`;
