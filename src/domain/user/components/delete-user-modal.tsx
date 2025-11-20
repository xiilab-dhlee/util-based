import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import { openDeleteSourcecodeModalAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { useDeleteUser } from "@/domain/user/hooks/use-delete-user";
import { USER_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * 사용자 삭제 모달 컴포넌트
 *
 * 선택한 사용자를 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 pubsub 이벤트를 발행하여 다른 컴포넌트에서 처리할 수 있습니다.
 */
export function DeleteUserModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteSourcecodeModalAtom,
  );

  // 삭제할 사용자 목록
  const [deleteUsers, setDeleteUsers] = useState<string[]>([]);

  const deleteUser = useDeleteUser();

  /**
   * 폼 제출 처리 함수
   *
   * 사용자 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    if (deleteUsers.length === 0) {
      toast.error("삭제할 사용자를 선택해 주세요.");
      return;
    }

    // 사용자 삭제 실행
    deleteUser.mutate(deleteUsers, {
      onSuccess: () => {
        toast.success("사용자 삭제 완료");
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 사용자 삭제 모달 데이터 구독
   */
  useSubscribe(USER_EVENTS.sendDeleteUser, (users: string[]) => {
    // 삭제할 사용자 목록 설정
    setDeleteUsers(users);
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
      title="사용자 삭제"
      centered
      okButtonProps={{
        loading: deleteUser.isPending,
      }}
    >
      <div>선택한 사용자를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 사용자는 복구되지 않습니다.</div>
    </Modal>
  );
}
