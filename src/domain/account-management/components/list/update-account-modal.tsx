"use client";

import { useState } from "react";
import styled from "styled-components";
import {
  Dropdown,
  Form,
  FormItem,
  Icon,
  InputNumber,
  Modal,
  Typography,
} from "xiilab-ui";

import {
  ACCOUNT_ROLE_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
} from "@/domain/account-management/constants/account-role.constant";
import { useAccountForm } from "@/domain/account-management/hooks/use-account-form";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { openUpdateAccountModalAtom } from "@/domain/account-management/state/account.atom";
import type { AccountRole } from "@/shared/constants/core.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";
import { subTitleStyle } from "@/styles/mixins/text";

/**
 * 계정 수정 모달 컴포넌트
 */
export function UpdateAccountModal() {
  const { open, onOpen, onClose } = useGlobalModal(openUpdateAccountModalAtom);
  const [account, setAccount] = useState<AccountListType | null>(null);

  // 폼 훅 사용
  const { formState, errors, setField, validate, reset, initializeForEdit } =
    useAccountForm();

  useSubscribe<AccountListType>(
    ACCOUNT_EVENTS.sendUpdateAccount,
    async (eventData) => {
      setAccount(eventData);
      // 폼 초기화
      initializeForEdit({
        role: eventData.role,
        isEnabled: eventData.isEnabled,
        workspaceLimitCount: eventData.workspaceLimitCount,
      });
      onOpen();
    },
  );

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = () => {
    const payload = validate();
    if (!payload) return;

    // TODO: API 연동 후 구현
    console.log({
      accountId: account?.id,
      ...payload,
    });
    handleClose();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={20} />}
      modalWidth={370}
      open={open}
      closable
      title="계정 상세 정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="저장"
      onOk={handleSubmit}
      centered
      showHeaderBorder
    >
      <Container>
        {/* 계정 기본 정보 */}
        <SubTitle>계정 기본 정보</SubTitle>
        <DetailCard>
          <SectionTitle>상세 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>이름</DetailLabel>
            <DetailValue>{account?.name || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>아이디</DetailLabel>
            <DetailValue>{account?.email || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>그룹</DetailLabel>
            <DetailValue>{account?.group || "-"}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>가입일</DetailLabel>
            <DetailValue>{formatDateSafely(account?.createdAt)}</DetailValue>
          </DetailRow>

          <Divider />

          <SectionTitle>워크스페이스 정보</SectionTitle>
          <DetailRow>
            <DetailLabel>보유 개수</DetailLabel>
            <DetailValue>{account?.workspaceCount ?? 0}개</DetailValue>
          </DetailRow>
        </DetailCard>

        {/* 계정 수정 정보 */}
        <SubTitle>계정 수정 정보</SubTitle>

        <Form layout="vertical">
          {/* 권한, 상태 가로 배치 */}
          <FormRowHorizontal>
            <HalfFormItem>
              <FormItem label="권한" required>
                <Dropdown
                  options={ACCOUNT_ROLE_OPTIONS}
                  value={formState.role}
                  onChange={(value) => setField("role", value as AccountRole)}
                  placeholder="권한 선택해 주세요."
                  width="100%"
                  status={errors.role ? "error" : undefined}
                />
              </FormItem>
            </HalfFormItem>
            <HalfFormItem>
              <FormItem label="상태" required>
                <Dropdown
                  options={ACCOUNT_STATUS_OPTIONS}
                  value={String(formState.isEnabled)}
                  onChange={(value) => setField("isEnabled", value === "true")}
                  placeholder="상태 선택"
                  width="100%"
                  status={errors.isEnabled ? "error" : undefined}
                />
              </FormItem>
            </HalfFormItem>
          </FormRowHorizontal>

          {/* 워크스페이스 생성 제한 개수 */}
          <FormItem label="워크스페이스 생성 제한 개수" required>
            <InputNumber
              value={formState.workspaceLimitCount}
              onChange={(value) =>
                setField("workspaceLimitCount", value as number)
              }
              min={1}
              suffix="개"
              width="100%"
              status={errors.workspaceLimitCount ? "error" : undefined}
            />
          </FormItem>
        </Form>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const SubTitle = styled.div`
  ${subTitleStyle(6)}
  margin-left: 6px;


`;

const DetailCard = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
`;

const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 82px;
  margin-right: 24px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
`;

const FormRowHorizontal = styled.div`
  display: flex;
  gap: 16px;
`;

const HalfFormItem = styled.div`
  flex: 1;
`;
