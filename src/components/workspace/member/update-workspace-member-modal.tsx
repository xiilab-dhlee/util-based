"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal } from "xiilab-ui";

import { openUpdateWorkspaceMemberModalAtom } from "@/atoms/workspace/workspace-member.atom";
import { ModalDetailCard } from "@/components/common/card/modal-detail-card";
import { FormItem } from "@/components/common/form/form-item";
import { FormLabel } from "@/components/common/form/form-label";
import { MySelect } from "@/components/common/select";
import pubsubConstants from "@/constants/common/pubsub.constant";
import workspaceMemberConstants from "@/constants/workspace/workspace-member.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import { useSelect } from "@/hooks/common/use-select";
import { useUpdateWorkspaceMember } from "@/hooks/workspace/use-update-workspace-member";
import type { WorkspaceMemberListType } from "@/schemas/workspace-member.schema";
import { subTitleStyle } from "@/styles/mixins/text";
import type { UpdateWorkspaceMemberPayload } from "@/types/workspace/workspace.interface";

export function UpdateWorkspaceMemberModal() {
  // 모달 열림/닫힘 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateWorkspaceMemberModalAtom,
  );

  const updateWorkspaceMember = useUpdateWorkspaceMember();

  const [workspaceMember, setWorkspaceMember] =
    useState<WorkspaceMemberListType | null>(null);

  const role = useSelect("", workspaceMemberConstants.role);

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      updateWorkspaceMember.mutate(payload);
    }
  };

  const createPayload = (): UpdateWorkspaceMemberPayload | null => {
    return {
      role: role.value,
    };
  };

  useSubscribe<WorkspaceMemberListType>(
    pubsubConstants.workspace.sendUpdateWorkspaceMember,
    async (eventData) => {
      setWorkspaceMember(eventData);
      role.setValue(eventData.role);
      // 모달 열기
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="계정 정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateWorkspaceMember.isPending, // MIG 업데이트 중일 때 확인 버튼 비활성화
      }}
    >
      <Container>
        <Subject>계정 기본 정보</Subject>
        <ModalDetailCard
          records={[
            {
              label: "이름",
              value: workspaceMember?.name,
            },
            {
              label: "아이디",
              value: workspaceMember?.email,
            },
            {
              label: "보유 개수",
              value: workspaceMember?.workspaceCount?.toString(),
            },
          ]}
        />
        <Subject style={{ marginTop: 16 }}>계정 수정 정보</Subject>
        <form style={{ width: "100%" }}>
          <FormItem>
            <FormLabel>권한</FormLabel>
            <MySelect
              options={role.options}
              setValue={role.setValue}
              value={role.value}
              width="100%"
              placeholder="권한을 선택해 주세요."
            />
          </FormItem>
        </form>
      </Container>
    </Modal>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Subject = styled.div`
  ${subTitleStyle(6)}

  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  color: #000;
  margin-left: 8px;
  margin-bottom: 5px;
  width: 100%;
`;
