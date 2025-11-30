import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openUpdateAccountStatusModalAtom } from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface UpdateAccountStatusPayload {
  accountId: string;
  accountName: string;
  currentStatus: boolean;
  nextStatus: boolean;
}

/**
 * 사용자 상태 변경 확인 모달 컴포넌트
 *
 * 사용자의 활성화/비활성화 상태를 변경하기 전에 확인을 요청하는 모달입니다.
 */
export function UpdateAccountStatusModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateAccountStatusModalAtom,
  );

  const [payload, setPayload] = useState<UpdateAccountStatusPayload | null>(
    null,
  );

  /**
   * 확인 버튼 클릭 핸들러
   * 상태 변경을 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (!payload) {
      toast.error("상태 변경 정보가 없습니다.");
      return;
    }

    // TODO: 추후 실제 API 호출 추가
    // updateAccountStatus.mutate({ accountId: payload.accountId, status: payload.nextStatus });

    toast.success(
      `${payload.accountName} 계정이 ${payload.nextStatus ? "활성화" : "비활성화"}되었습니다.`,
    );
    onClose();
  };

  /**
   * 사용자 상태 변경 모달 데이터 구독
   */
  useSubscribe(
    ACCOUNT_EVENTS.sendUpdateAccountStatus,
    (data: UpdateAccountStatusPayload) => {
      setPayload(data);
      onOpen();
    },
  );

  const newStatus = payload?.currentStatus ? "비활성화" : "활성화";

  return (
    <Modal
      variant="confirm"
      modalWidth={300}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      title="계정 상태 변경"
      centered
    >
      <div>
        {payload?.accountName} 계정을 {newStatus}하시겠습니까?
      </div>
      <div>
        {payload?.currentStatus
          ? "비활성화 시 해당 계정은 로그인할 수 없습니다."
          : "활성화 시 해당 계정이 다시 사용 가능합니다."}
      </div>
    </Modal>
  );
}
