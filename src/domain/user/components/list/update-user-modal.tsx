"use client";

import { useState } from "react";
import styled from "styled-components";
import { Dropdown, Icon, Modal } from "xiilab-ui";

import { useUpdateUser } from "@/domain/user/hooks/use-update-user";
import type { UserListType } from "@/domain/user/schemas/user.schema";
import { openUpdateUserModalAtom } from "@/domain/user/state/user.atom";
import { WORKSPACE_MEMBER_ROLE_OPTIONS } from "@/domain/workspace/constants/workspace-member.constant";
import type { UpdateWorkspaceMemberPayload } from "@/domain/workspace/types/workspace.type";
import { ModalDetailCard } from "@/shared/components/card/modal-detail-card";
import { FormLabel } from "@/shared/components/form/form-label";
import { USER_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { useSelect } from "@/shared/hooks/use-select";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { subTitleStyle } from "@/styles/mixins/text";

export function UpdateUserModal() {
  // 모달 열림/닫힘 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openUpdateUserModalAtom);

  const updateUser = useUpdateUser();

  const [user, setUser] = useState<UserListType | null>(null);

  const roleSelect = useSelect(null, WORKSPACE_MEMBER_ROLE_OPTIONS);

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      updateUser.mutate(payload);
    }
  };

  const createPayload = (): UpdateWorkspaceMemberPayload | null => {
    return {
      role: roleSelect.value,
    };
  };

  useSubscribe<UserListType>(USER_EVENTS.sendUpdateUser, async (eventData) => {
    setUser(eventData);
    roleSelect.setValue(eventData.role);
    onOpen();
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="계정 상세 정보"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateUser.isPending, // MIG 업데이트 중일 때 확인 버튼 비활성화
      }}
    >
      <Container>
        <ModalDetailCard
          records={[
            {
              label: "이름",
              value: user?.name,
            },
            {
              label: "아이디",
              value: user?.email,
            },
            {
              label: "그룹",
              value: user?.group,
            },
            {
              label: "가입일",
              value: user?.createdAt,
            },
            {
              label: "가입 경로",
              value: "AstraGo",
            },
            {
              label: "보유 개수",
              value: "0개",
            },
          ]}
        />
        <Subject style={{ marginTop: 16 }}>계정 수정 정보</Subject>
        <form style={{ width: "100%" }}>
          <FormItem>
            <FormLabel>권한</FormLabel>
            <Dropdown
              options={roleSelect.options}
              onChange={roleSelect.onChange}
              value={roleSelect.value}
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
