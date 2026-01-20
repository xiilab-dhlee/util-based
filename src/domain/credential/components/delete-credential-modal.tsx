"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";
import { Modal } from "xiilab-ui";

import { getGetAllCredentialsQueryKey } from "@/api/generated/admin-credential/admin-credential";
import {
  getGetCredentialsQueryKey,
  useDeleteCredential,
} from "@/api/generated/credential/credential";
import { CREDENTIAL_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface Payload {
  accountId: string;
  credentialId: number;
}

export function DeleteCredentialModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [credentialId, setCredentialId] = useState<number | null>(null);

  const { mutate, isPending } = useDeleteCredential();

  const handleClose = () => {
    if (isPending) return;

    setOpen(false);
    setAccountId(null);
    setCredentialId(null);
  };

  const handleDelete = () => {
    if (isPending) return;
    if (accountId === null || credentialId === null) return;

    mutate(
      {
        accountId,
        credentialId,
      },
      {
        onSuccess: () => {
          // Orval 쿼리 키 무효화 (params가 다양할 수 있으므로 exact: false)
          queryClient.invalidateQueries({
            queryKey: getGetCredentialsQueryKey(accountId),
            exact: false,
          });
          // Admin 크리덴셜 목록 쿼리 키 무효화
          queryClient.invalidateQueries({
            queryKey: getGetAllCredentialsQueryKey(),
            exact: false,
          });
          handleClose();
        },
      },
    );
  };

  useSubscribe<Payload>(CREDENTIAL_EVENTS.openDeleteModal, (payload) => {
    setAccountId(payload.accountId);
    setCredentialId(payload.credentialId);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleDelete}
      title="크리덴셜 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending || accountId === null || credentialId === null,
        loading: isPending,
      }}
    >
      <MessageContainer>
        <Message>
          선택된 크리덴셜을 삭제하시겠습니까?
          <br />
          크리덴셜 삭제 시 복구되지 않습니다.
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
