"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { Icon, Input, Modal } from "xiilab-ui";

import { useUpdateAccount } from "@/domain/account-management/hooks/use-update-account";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import type { UpdateAccountPayload } from "@/domain/account-management/types/account.type";
import { LoggedInUserCard } from "@/shared/components/card/logged-in-user-card";
import { FormLabel } from "@/shared/components/form/form-label";
import {
  ACCOUNT_EVENTS,
  COMMON_EVENTS,
} from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openUpdatePasswordModalAtom } from "@/shared/state/modal.atom";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

/**
 * 비밀번호 수정 모달 컴포넌트
 */
export function UpdatePasswordModal() {
  const publish = usePublish();
  const formRef = useRef<HTMLFormElement>(null);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(openUpdatePasswordModalAtom);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const updateAccount = useUpdateAccount();

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      updateAccount.mutate(payload, {
        onSuccess: () => {
          publish(ACCOUNT_EVENTS.sendUpdateAccount, payload);
          onClose();
        },
      });
    }
  };

  const createPayload = (): UpdateAccountPayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      username: email,
      password: formData.get("updateConfirmPassword") as string,
    };
  };

  useSubscribe<Pick<AccountListType, "name" | "email">>(
    COMMON_EVENTS.sendUpdatePassword,
    ({ name, email }) => {
      setUsername(name);
      setEmail(email);

      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Lock" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="비밀번호 재확인"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="확인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateAccount.isPending,
      }}
    >
      <SectionTitle>회원 상세 정보</SectionTitle>
      <LoggedInUserCard username={username} email={email} />
      <Workspace>
        <WorkspaceItem>
          <WorkspaceKey>이름</WorkspaceKey>
          <WorkspaceValue>AstraGo PO</WorkspaceValue>
        </WorkspaceItem>
        <WorkspaceItem>
          <WorkspaceKey>워크스페이스 생성 제한 개수</WorkspaceKey>
          <WorkspaceValue>3개</WorkspaceValue>
        </WorkspaceItem>
        <WorkspaceItem>
          <WorkspaceKey>워크스페이스 보유 개수</WorkspaceKey>
          <WorkspaceValue>1개</WorkspaceValue>
        </WorkspaceItem>
      </Workspace>
      <SectionTitle>정보 수정</SectionTitle>
      <form ref={formRef}>
        {/* <FormItem>
          <FormLabel htmlFor="updateUserName">이름</FormLabel>
          <Input
            type="text"
            id="updateUserName"
            name="updateUserName"
            placeholder="이름을 입력해주세요."
            autoComplete="off"
            width="100%"
          />
        </FormItem> */}
        <FormItem>
          <FormLabel htmlFor="updatePassword">신규 비밀번호</FormLabel>
          <Input
            type="password"
            id="updatePassword"
            name="updatePassword"
            placeholder="비밀번호를 입력해주세요."
            autoComplete="off"
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="updateConfirmPassword">
            신규 비밀번호 확인
          </FormLabel>
          <Input
            type="password"
            id="updateConfirmPassword"
            name="updateConfirmPassword"
            placeholder="비밀번호를 한번 더 입력해주세요."
            autoComplete="off"
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}

const SectionTitle = styled(UserMonitoringSectionTitle)`
  color: #000;
  margin-left: 7px;
  margin-bottom: 10px;
  font-size: 12px;
`;

const Workspace = styled.div`
  border: 1px solid #e9e9e9;
  height: 104px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 6px;
  margin-bottom: 15px;
`;

const WorkspaceItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
`;

const WorkspaceKey = styled.div`
  width: 133px;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #484848;
`;

const WorkspaceValue = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #191b26;
`;
