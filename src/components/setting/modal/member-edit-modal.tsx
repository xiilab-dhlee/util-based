"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Dropdown, Icon, Modal, Typography } from "xiilab-ui";

import {
  closeMemberEditModalAtom,
  memberEditDataAtom,
  memberEditModalOpenAtom,
} from "@/atoms/setting/setting-modal.atom";

/**
 * 멤버 계정 정보 수정 모달 컴포넌트
 *
 * 멤버의 정보를 수정하는 모달입니다.
 * - 계정 상세 정보 (읽기 전용)
 * - 권한 수정
 * - 취소/저장 버튼
 */
export function MemberEditModal() {
  const isOpen = useAtomValue(memberEditModalOpenAtom);
  const memberData = useAtomValue(memberEditDataAtom);
  const closeMemberEditModal = useSetAtom(closeMemberEditModalAtom);

  // 권한 상태 관리
  const [selectedRole, setSelectedRole] = useState<string>("");

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (memberData && isOpen) {
      setSelectedRole(memberData.role);
    }
  }, [memberData, isOpen]);

  const handleSave = () => {
    // TODO: 저장 로직 구현
    console.log("저장할 권한:", selectedRole);
    closeMemberEditModal();
  };

  const handleCancel = () => {
    // 변경사항 리셋
    if (memberData) {
      setSelectedRole(memberData.role);
    }
    closeMemberEditModal();
  };

  const roleItems = [
    { label: "User", value: "User" },
    { label: "Admin", value: "Admin" },
    { label: "Owner", value: "Owner" },
  ];

  if (!memberData) return null;

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      type="primary"
      icon={<Icon name="Edit02" size={20} color="#FFF" />}
      title="계정 정보 수정"
      modalWidth={370}
      centered
      okText="저장"
      cancelText="취소"
      onOk={handleSave}
    >
      <ModalContent>
        {/* 계정 상세 정보 섹션 */}
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
            <Label>가입일</Label>
            <Value>{memberData.joinDate || "2025.08.13"}</Value>
          </DetailRow>
          <DetailRow>
            <Label>그룹</Label>
            <Value>{memberData.group || "서비스 개발"}</Value>
          </DetailRow>
        </DetailSection>

        {/* 정보 수정 섹션 */}
        <SectionTitle>정보 수정</SectionTitle>
        <EditSection>
          <EditRow>
            <EditLabel>권한</EditLabel>
            <DropdownContainer>
              <Dropdown
                value={selectedRole}
                onSelect={(value: string) => setSelectedRole(value)}
                options={roleItems}
                width="100%"
                placeholder="권한을 선택하세요"
              />
            </DropdownContainer>
          </EditRow>
        </EditSection>
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

  &:not(:first-child) {
    margin-top: 20px;
  }

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
  margin-bottom: 16px;
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
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditSection = styled.div`
  margin-bottom: 0;
`;

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const EditLabel = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px is closest to 14px
  as: "span",
})`
  font-size: 14px; // Keep custom 14px
  color: #333;
  min-width: 40px;
`;

const DropdownContainer = styled.div`
  flex: 1;
`;
