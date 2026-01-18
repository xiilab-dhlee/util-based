"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import { useResetPasswordByAdmin } from "@/api/generated/admin-account-management/admin-account-management";
import type { AccountItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { openResetPasswordConfirmModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { pubsubUtil } from "@/shared/utils/pubsub.util";

export function ConfirmResetPasswordModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openResetPasswordConfirmModalAtom,
  );
  const [account, setAccount] = useState<AccountItemResponse | null>(null);

  const resetPasswordMutation = useResetPasswordByAdmin();
  const isPending = resetPasswordMutation.isPending;

  const handleConfirmReset = () => {
    if (!account || isPending) return;

    resetPasswordMutation.mutate(
      { accountId: account.accountId },
      {
        onSuccess: (response) => {
          if (!response?.newPassword) {
            toast.error("새 비밀번호를 받지 못했습니다. 다시 시도해주세요.");
            return;
          }

          onClose();
          pubsubUtil.publish(ACCOUNT_EVENTS.showResetPasswordResult, {
            accountName: account.accountName,
            email: account.email,
            newPassword: response.newPassword,
          });
        },
      },
    );
  };

  const handleClose = () => {
    onClose();
  };

  useSubscribe(
    ACCOUNT_EVENTS.sendResetPassword,
    (accountData: AccountItemResponse) => {
      setAccount(accountData);
      onOpen();
    },
  );

  return (
    <Modal
      type="danger"
      variant="custom"
      icon={<Icon name="Error" color="#fff" size={20} />}
      modalWidth={300}
      open={open}
      onCancel={handleClose}
      onOk={handleConfirmReset}
      title="패스워드 초기화"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
      okText="초기화"
      cancelText="취소"
    >
      패스워드는 랜덤으로 생성됩니다. <br />
      사용자 패스워드를 초기화 하겠습니까?
    </Modal>
  );
}
