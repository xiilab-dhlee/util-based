"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import { getGetSmtpSetQueryKey } from "@/api/generated/smtp-settings/smtp-settings";
import { useDeleteSmtpSet } from "@/api/generated/smtp-settings-admin/smtp-settings-admin";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteSmtpModalPayload {
  id: number;
}

export function DeleteSmtpModal() {
  const [open, setOpen] = useState(false);
  const [smtpId, setSmtpId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteSmtpSet();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleDelete = () => {
    if (smtpId === null || isPending) return;

    mutate(
      { smtpSetId: smtpId },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetSmtpSetQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DeleteSmtpModalPayload>(
    SYSTEM_SETTING_EVENTS.openSmtpDeleteModal,
    (payload) => {
      setSmtpId(payload.id);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      title="SMTP 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <div>
        SMTP 계정을 삭제하시겠습니까?
        <br />
        삭제 시 이메일 발송 기능을 사용할 수 없습니다.
      </div>
    </Modal>
  );
}
