import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useApproveSignupRequestsAction } from "@/domain/account-management/hooks/account-actions";
import { openApproveAccountPendingModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ApproveAccountPendingPayload {
  accountIds: string[];
}

export function ApproveAccountPendingModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openApproveAccountPendingModalAtom,
  );

  const [payload, setPayload] = useState<ApproveAccountPendingPayload | null>(
    null,
  );

  const { mutate, isPending } = useApproveSignupRequestsAction({
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
      toast.error("승인할 계정을 선택해 주세요.");
      return;
    }
    mutate({
      data: {
        accountId: payload.accountIds,
      },
    });
  };

  useSubscribe(
    ACCOUNT_EVENTS.sendApproveAccountPending,
    (data: ApproveAccountPendingPayload) => {
      setPayload(data);
      onOpen();
    },
  );

  const count = payload?.accountIds.length || 0;
  const isSingle = count === 1;

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending, disabled: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      title="가입 승인"
      centered
    >
      <div>
        {isSingle
          ? `해당 계정의 가입을 승인하시겠습니까?`
          : `선택한 ${count}개의 가입 신청을 승인하시겠습니까?`}
      </div>
      <div>승인 시 해당 계정으로 로그인이 가능합니다.</div>
    </Modal>
  );
}
