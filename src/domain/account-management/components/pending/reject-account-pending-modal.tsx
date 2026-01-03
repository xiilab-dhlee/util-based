import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useRejectSignupRequestsAction } from "@/domain/account-management/hooks/account-actions";
import { openRejectAccountPendingModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface RejectAccountPendingPayload {
  accountIds: string[];
}

export function RejectAccountPendingModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openRejectAccountPendingModalAtom,
  );

  const [payload, setPayload] = useState<RejectAccountPendingPayload | null>(
    null,
  );

  const { mutate, isPending } = useRejectSignupRequestsAction({
    mutation: {
      onSuccess: () => {
        onClose();
      },
    },
  });

  const handleCancel = () => {
    if (isPending) return;
    onClose();
  };

  const handleOk = () => {
    if (isPending) return;
    if (!payload || payload.accountIds.length === 0) {
      toast.error("반려할 계정을 선택해 주세요.");
      return;
    }

    mutate({
      data: {
        accountId: payload.accountIds,
      },
    });
  };

  useSubscribe(
    ACCOUNT_EVENTS.sendRejectAccountPending,
    (data: RejectAccountPendingPayload) => {
      setPayload(data);
      onOpen();
    },
  );

  const count = payload?.accountIds.length || 0;
  const isSingle = count === 1;

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending, disabled: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      title="가입 반려"
      centered
    >
      <div>
        {isSingle
          ? `해당 계정의 가입을 반려하시겠습니까?`
          : `선택한 ${count}개의 가입 신청을 반려하시겠습니까?`}
      </div>
      <div>반려 시 해당 가입 신청은 삭제됩니다.</div>
    </Modal>
  );
}
