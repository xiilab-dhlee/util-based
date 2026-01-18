import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeleteAccountAction } from "@/domain/account-management/hooks/account-actions";
import { openDeleteAccountModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeleteAccountModal() {
  const { open, onOpen, onClose } = useGlobalModal(openDeleteAccountModalAtom);
  const [deleteAccounts, setDeleteAccounts] = useState<string[]>([]);

  const deleteAccountMutation = useDeleteAccountAction();
  const isPending = deleteAccountMutation.isPending;

  const handleOk = () => {
    if (deleteAccounts.length === 0 || isPending) {
      toast.error("삭제할 계정을 선택해 주세요.");
      return;
    }

    deleteAccountMutation.mutate(
      { data: { accountId: deleteAccounts } },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  useSubscribe(ACCOUNT_EVENTS.sendDeleteAccount, (accounts: string[]) => {
    setDeleteAccounts(accounts);
    onOpen();
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="계정 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>
        선택한 {deleteAccounts.length}개의 계정을 삭제하는 경우 해당 계정에 대한
        데이터는 원복할 수 없습니다.
      </div>
      <div>계정을 삭제하시겠습니까?</div>
    </Modal>
  );
}
