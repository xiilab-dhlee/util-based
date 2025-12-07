"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Modal } from "xiilab-ui";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import { useDeleteSmtp } from "@/domain/system-setting/hooks/use-delete-smtp";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface DeleteSmtpModalPayload {
  id: number;
}

export function DeleteSmtpModal() {
  const [open, setOpen] = useState(false);
  const [smtpId, setSmtpId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const deleteSmtp = useDeleteSmtp();

  // PubSub 구독 - SMTP 삭제 모달 열기 이벤트
  useSubscribe<DeleteSmtpModalPayload>(
    SYSTEM_SETTING_EVENTS.openSmtpDeleteModal,
    useCallback((payload) => {
      setSmtpId(payload.id);
      setOpen(true);
    }, []),
  );

  const handleCancel = () => {
    setOpen(false);
    setSmtpId(null);
  };

  const handleDelete = () => {
    if (smtpId === null) return;

    deleteSmtp.mutate(smtpId, {
      onSuccess: () => {
        // SMTP 데이터 갱신
        queryClient.invalidateQueries({ queryKey: smtpKeys.detail() });
        handleCancel();
      },
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
      title="SMTP 삭제"
      centered
      okButtonProps={{
        loading: deleteSmtp.isPending,
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
