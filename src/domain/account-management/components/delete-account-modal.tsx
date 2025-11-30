import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { useDeleteAccount } from "@/domain/account-management/hooks/use-delete-account";
import { openDeleteAccountModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 계정 삭제 모달 컴포넌트
 *
 * 선택한 계정을 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다.
 */
export function DeleteAccountModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteAccountModalAtom);

  // 삭제할 계정 목록
  const [deleteAccounts, setDeleteAccounts] = useState<string[]>([]);

  const deleteAccount = useDeleteAccount();

  /**
   * 폼 제출 처리 함수
   *
   * 계정 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (deleteAccounts.length === 0) {
      toast.error("삭제할 계정을 선택해 주세요.");
      return;
    }

    // 계정 삭제 실행
    deleteAccount.mutate(deleteAccounts, {
      onSuccess: () => {
        toast.success("계정 삭제 완료");
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 계정 삭제 모달 데이터 구독
   */
  useSubscribe(ACCOUNT_EVENTS.sendDeleteAccount, (accounts: string[]) => {
    // 삭제할 계정 목록 설정
    setDeleteAccounts(accounts);
    // 삭제 모달 열기
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
      okButtonProps={{
        loading: deleteAccount.isPending,
      }}
    >
      <div>
        계정을 삭제하는 경우 해당 계정에 대한 데이터는 원복할 수 없습니다.
      </div>
      <div>계정을 삭제하시겠습니까?</div>
    </Modal>
  );
}
