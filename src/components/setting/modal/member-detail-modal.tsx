"use client";

import { useAtomValue, useSetAtom } from "jotai";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import {
  closeMemberDetailModalAtom,
  memberDetailDataAtom,
  memberDetailModalOpenAtom,
  openMemberEditModalAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 멤버 계정 상세 정보 모달 컴포넌트
 *
 * 멤버의 상세 정보를 표시하는 모달입니다.
 * - 아이디, 이름, 상태, 권한, 가입일, 그룹 정보
 * - 확인 버튼
 */
export function MemberDetailModal() {
  const isOpen = useAtomValue(memberDetailModalOpenAtom);
  const memberData = useAtomValue(memberDetailDataAtom);
  const closeMemberDetailModal = useSetAtom(closeMemberDetailModalAtom);
  const openMemberEditModal = useSetAtom(openMemberEditModalAtom);

  const handleClose = () => {
    closeMemberDetailModal();
  };

  const handleEdit = () => {
    if (memberData) {
      closeMemberDetailModal(); // 현재 모달 닫기
      openMemberEditModal(memberData); // 수정 모달 열기
    }
  };

  if (!memberData) return null;

  return (
    <Modal
      open={isOpen}
      type="primary"
      icon={<Icon name="PersonFilled" size={20} color="#FFF" />}
      title="계정 상세 정보"
      modalWidth={370}
      centered
      okText="확인"
      cancelText="수정"
      onOk={handleClose}
      onCancel={handleEdit}
    >
      <ModalContent>
        <SectionTitle>계정 상세 정보</SectionTitle>
        <DetailSection>
          <DetailRow>
            <Label>아이디</Label>
            <Value>{memberData.email}</Value>
          </DetailRow>
          <DetailRow>
            <Label>이름</Label>
            <Value>{memberData.name}</Value>
          </DetailRow>
          <DetailRow>
            <Label>상태</Label>
            <Value>{memberData.status || "활성화"}</Value>
          </DetailRow>
          <DetailRow>
            <Label>권한</Label>
            <Value>{memberData.role}</Value>
          </DetailRow>
          <DetailRow>
            <Label>가입일</Label>
            <Value>{memberData.joinDate || "2025.08.13"}</Value>
          </DetailRow>
          <DetailRow>
            <Label>그룹</Label>
            <Value>{memberData.group || "서비스 개발"}</Value>
          </DetailRow>
        </DetailSection>
      </ModalContent>
    </Modal>
  );
}

// Styled Components
const ModalContent = styled.div`
  padding: 0;
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "h3",
})`
  font-weight: 600; // Keep 600 weight
  font-size: 14px; // Keep custom 14px
  color: #333;
  margin: 0 0 12px 0;
  position: relative;
  padding-left: 8px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 2px;
    width: 2px;
    height: 12px;
    background-color: rgba(31, 91, 255, 0.8);
  }
`;

const DetailSection = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})`
  font-size: 14px; // Keep custom 14px
  color: #666;
  min-width: 60px;
`;

const Value = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})`
  font-size: 14px; // Keep custom 14px
  color: #000;
`;
