import { useState } from "react";
import { Modal } from "xiilab-ui";

import { getAccountStatusLabelFromBoolean } from "@/domain/account-management/constants/account.constant";
import { useUpdateAccountEnabledAction } from "@/domain/account-management/hooks/account-actions";
import { openUpdateAccountStatusModalAtom } from "@/domain/account-management/state/account.atom";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface UpdateAccountStatusPayload {
  accountId: string;
  accountName: string;
  currentStatus: boolean;
}

export function UpdateAccountStatusModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateAccountStatusModalAtom,
  );

  const [payload, setPayload] = useState<UpdateAccountStatusPayload | null>(
    null,
  );

  const updateAccountEnabledMutation = useUpdateAccountEnabledAction();
  const isPending = updateAccountEnabledMutation.isPending;

  const handleOk = () => {
    if (!payload || isPending) {
      return;
    }

    const nextStatus = !payload.currentStatus;

    updateAccountEnabledMutation.mutate(
      {
        accountId: payload.accountId,
        data: { isEnabled: nextStatus },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  useSubscribe(
    ACCOUNT_EVENTS.sendUpdateAccountStatus,
    (data: UpdateAccountStatusPayload) => {
      setPayload(data);
      onOpen();
    },
  );

  if (!payload) {
    return (
      <Modal
        variant="confirm"
        modalWidth={300}
        open={open}
        onCancel={onClose}
        onOk={handleOk}
        title="계정 상태 변경"
        centered
        closable={!isPending}
        maskClosable={!isPending}
        keyboard={!isPending}
        okButtonProps={{
          disabled: true,
        }}
        cancelButtonProps={{ disabled: isPending }}
      >
        <DataErrorState
          title="계정 상태 정보를 불러 올 수 없습니다."
          description="잠시 후 다시 시도해 주세요."
        />
      </Modal>
    );
  }

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      showCancelButton
      onOk={handleOk}
      title="계정 상태 변경"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>
        해당 계정을 {getAccountStatusLabelFromBoolean(!payload.currentStatus)}
        하시겠습니까?
      </div>
      <div>
        {payload.currentStatus
          ? "비활성화 시 해당 계정은 로그인할 수 없습니다."
          : "활성화 시 해당 계정이 다시 사용 가능합니다."}
      </div>
    </Modal>
  );
}
