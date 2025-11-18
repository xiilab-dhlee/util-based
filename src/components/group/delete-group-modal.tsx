"use client";

import { useState } from "react";
import { Modal } from "xiilab-ui";

import { openDeleteGroupModalAtom } from "@/atoms/group/group.atom";
import { GROUP_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useDeleteGroup } from "@/hooks/group/use-delete-group";

/**
 * 그룹 삭제 모달 컴포넌트
 *
 * 선택한 그룹을 삭제할 수 있는 모달입니다.
 */
export function DeleteGroupModal() {
  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openDeleteGroupModalAtom);

  // 삭제할 그룹 ID
  const [deleteGroupId, setDeleteGroupId] = useState<string>("");

  const deleteGroup = useDeleteGroup();

  /**
   * 폼 제출 처리 함수
   *
   * 그룹 삭제를 실행하고 모달을 닫습니다.
   * 삭제 성공 시 관련 컴포넌트에서 데이터가 자동으로 갱신됩니다.
   */
  const handleOk = () => {
    // 그룹 삭제 실행
    deleteGroup.mutate(deleteGroupId, {
      onSuccess: () => {
        // 모달 닫기
        onClose();
      },
    });
  };

  /**
   * 그룹 삭제 모달 데이터 구독
   */
  useSubscribe(GROUP_EVENTS.sendDeleteGroup, (groupId) => {
    // 삭제할 그룹 ID 설정
    setDeleteGroupId(groupId as string);
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
      title="그룹 삭제"
      centered
      okButtonProps={{
        loading: deleteGroup.isPending,
      }}
    >
      <div>선택한 그룹을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 그룹은 복구되지 않습니다.</div>
    </Modal>
  );
}
