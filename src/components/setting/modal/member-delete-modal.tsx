"use client";

import { Modal } from "xiilab-ui";
import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import {
  memberDeleteModalOpenAtom,
  memberDeleteDataAtom,
  closeMemberDeleteModalAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 멤버 삭제 모달 컴포넌트
 *
 * 워크스페이스에서 멤버를 삭제할 수 있는 모달입니다.
 */
function MemberDeleteModal() {
  const isVisible = useAtomValue(memberDeleteModalOpenAtom);
  const memberData = useAtomValue(memberDeleteDataAtom);
  const closeModal = useSetAtom(closeMemberDeleteModalAtom);

  /**
   * 멤버 삭제 확인 처리 함수
   *
   * 실제 멤버 삭제 API를 호출하고 모달을 닫습니다.
   */
  const handleDelete = () => {
    if (!memberData) return;

    // TODO: 실제 멤버 삭제 API 호출
    console.log("멤버 삭제:", memberData);

    // 모달 닫기
    closeModal();
  };

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={isVisible}
      onCancel={closeModal}
      onOk={handleDelete}
      title="멤버 삭제"
      centered
      okText="삭제"
      cancelText="취소"
      style={{
        height: "166px",
        maxHeight: "166px",
      }}
    >
      <ModalContent>
        <PrimaryMessage>
          선택된 멤버를 워크스페이스에서 삭제하시겠습니까?
          <br />
          삭제된 멤버는 워크스페이스의 정보를 볼 수 없습니다.
        </PrimaryMessage>
      </ModalContent>
    </Modal>
  );
}

export default MemberDeleteModal;

const ModalContent = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PrimaryMessage = styled.div`
  font-size: 12px;
  color: #000;
  line-height: 18px;
`;
