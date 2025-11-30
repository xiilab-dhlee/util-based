import { useResetAtom } from "jotai/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  accountPendingCheckedListAtom,
  openRejectAccountPendingModalAtom,
} from "@/domain/account-management/state/account.atom";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface RejectAccountPendingPayload {
  /** 반려할 계정 ID 목록 */
  accountIds: string[];
  /** 반려할 계정 이름 목록 (표시용) */
  accountNames: string[];
}

/**
 * 가입 반려 확인 모달 컴포넌트
 *
 * 선택한 가입 신청을 반려하기 전에 확인을 요청하는 모달입니다.
 * 단일 또는 다중 선택 모두 지원합니다.
 */
export function RejectAccountPendingModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openRejectAccountPendingModalAtom,
  );
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  const [payload, setPayload] = useState<RejectAccountPendingPayload | null>(
    null,
  );

  /**
   * 확인 버튼 클릭 핸들러
   * 반려를 실행하고 모달을 닫습니다.
   */
  const handleOk = () => {
    if (!payload || payload.accountIds.length === 0) {
      toast.error("반려할 계정을 선택해 주세요.");
      return;
    }

    const count = payload.accountIds.length;
    toast.success(`${count}개의 가입 신청이 반려되었습니다.`);
    resetCheckedList();
    onClose();
  };

  /**
   * 가입 반려 모달 데이터 구독
   */
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
      onCancel={onClose}
      onOk={handleOk}
      title="가입 반려"
      centered
    >
      <div>
        {isSingle
          ? `${payload?.accountNames[0]} 계정의 가입을 반려하시겠습니까?`
          : `선택한 ${count}개의 가입 신청을 반려하시겠습니까?`}
      </div>
      <div>반려 시 해당 가입 신청은 삭제됩니다.</div>
    </Modal>
  );
}
