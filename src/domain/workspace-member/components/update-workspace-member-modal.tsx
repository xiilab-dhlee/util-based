"use client";

import { useState } from "react";
import styled from "styled-components";
import { Dropdown, Form, FormItem, Icon, Modal } from "xiilab-ui";

import { WORKSPACE_MEMBER_ROLE_OPTIONS } from "@/domain/workspace/constants/workspace.constant";
// TODO: Orval API 연동 필요 - useUpdateMemberRole 사용
// import { useUpdateWorkspaceMember } from "@/domain/workspace/hooks/use-update-workspace-member";
// import type { UpdateWorkspaceMemberPayload } from "@/domain/workspace/types/workspace.type";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { openUpdateWorkspaceMemberModalAtom } from "@/domain/workspace-member/state/workspace-member.atom";
import { ModalDetailCard } from "@/shared/components/card/modal-detail-card";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useSelect } from "@/shared/hooks/use-select";
import { subTitleStyle } from "@/styles/mixins/text";

export function UpdateWorkspaceMemberModal() {
  // 모달 열림/닫힘 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateWorkspaceMemberModalAtom,
  );

  // TODO: Orval API 연동 필요
  // const updateWorkspaceMember = useUpdateWorkspaceMember();

  const [workspaceMember, setWorkspaceMember] =
    useState<WorkspaceMemberListType | null>(null);

  const roleSelect = useSelect(null, WORKSPACE_MEMBER_ROLE_OPTIONS);
  const [roleError, setRoleError] = useState<string | null>(null);
  // TODO: Orval API 연동 후 isPending 사용
  const isSubmitting = false; // updateWorkspaceMember.isPending;

  const handleSubmit = () => {
    setRoleError(null);

    // TODO: Orval API 연동 필요
    // const payload = { memberRole: roleSelect.value };
    // updateWorkspaceMember.mutate({ workspaceId, accountId: workspaceMember?.id, data: payload });
    console.log("TODO: Orval API 연동 필요", { role: roleSelect.value });
  };

  useSubscribe<WorkspaceMemberListType>(
    WORKSPACE_EVENTS.sendUpdateWorkspaceMember,
    async (eventData) => {
      setWorkspaceMember(eventData);
      roleSelect.setValue(eventData.role);
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
        disabled: isSubmitting,
      }}
    >
      <Container>
        <Subject>권한 수정</Subject>
        <ModalDetailCard
          records={[
            {
              label: "이름",
              value: workspaceMember?.name,
            },
            {
              label: "이메일",
              value: workspaceMember?.email,
            },
            {
              label: "생성 개수",
              value: workspaceMember?.workspaceCount?.toString(),
            },
          ]}
        />
        <Subject style={{ marginTop: 16 }}>계정 수정 정보</Subject>
        <StyledForm layout="vertical">
          <FormItem label="권한" required>
            <Dropdown
              options={roleSelect.options}
              onChange={roleSelect.onChange}
              value={roleSelect.value}
              width="100%"
              placeholder="권한을 선택해 주세요."
              disabled={isSubmitting}
              status={roleError ? "error" : undefined}
            />
          </FormItem>
        </StyledForm>
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

const StyledForm = styled(Form)`
  width: 100%;
`;
