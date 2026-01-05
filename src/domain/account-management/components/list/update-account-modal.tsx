"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import type { z } from "zod";

import { useGetAccountDetail } from "@/api/generated/admin-account/admin-account";
import { updateAccountBody } from "@/api/generated/admin-account/admin-account.zod";
import {
  ACCOUNT_ROLE_OPTIONS,
  ACCOUNT_STATUS_OPTIONS,
  getAccountStatusKeyFromBoolean,
} from "@/domain/account-management/constants/account.constant";
import { useUpdateAccountAction } from "@/domain/account-management/hooks/account-actions";
import { openUpdateAccountModalAtom } from "@/domain/account-management/state/account.atom";
import { updateAccountErrorMap } from "@/domain/account-management/utils/update-account-form.util";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { formatDateSafely } from "@/shared/utils/date.util";
import { subTitleStyle } from "@/styles/mixins/text";

type AccountUpdateFormType = z.infer<typeof updateAccountBody>;

/*
 * 계정 수정 모달 컴포넌트
 */
export function UpdateAccountModal() {
  const { open, onOpen, onClose } = useGlobalModal(openUpdateAccountModalAtom);
  const [accountId, setAccountId] = useState<string>("");

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AccountUpdateFormType>({
    resolver: zodResolver(updateAccountBody, {
      path: [],
      async: false,
      errorMap: updateAccountErrorMap,
    }),
  });

  const updateAccountMutation = useUpdateAccountAction();
  const isPending = updateAccountMutation.isPending;

  const { data: accountDetail, isFetching: isFetchingAccountDetail } =
    useGetAccountDetail(accountId, {
      query: {
        enabled: open && Boolean(accountId),
      },
    });

  useSubscribe<string>(ACCOUNT_EVENTS.sendUpdateAccount, (nextAccountId) => {
    setAccountId(nextAccountId);
    onOpen();
  });

  const handleStatusChange = (onChange: (value: boolean) => void) => {
    return (value: string | boolean) => {
      onChange(String(value) === "true");
    };
  };

  const handleClose = () => {
    if (isPending) return;
    onClose();
    resetForm({
      accountRole: undefined,
      isEnabled: undefined,
      workspaceLimitCount: 1,
    });
    setAccountId("");
  };

  const onSubmit = (data: AccountUpdateFormType) => {
    if (!accountDetail) return;

    updateAccountMutation.mutate(
      {
        accountId: accountDetail.accountId,
        data,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  // accountDetail 로드 시 폼 초기화
  useEffect(() => {
    if (accountDetail) {
      resetForm({
        accountRole: accountDetail.accountRole,
        isEnabled: accountDetail.isEnabled,
        workspaceLimitCount: accountDetail.workspaceLimitCount ?? 1,
      });
    }
  }, [accountDetail, resetForm]);

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={20} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="계정 상세 정보 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="저장"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        loading: isPending,
        disabled: isPending || isFetchingAccountDetail || !accountDetail,
      }}
    >
      <Container>
        {/* 계정 기본 정보 */}
        <section>
          <SubTitle>계정 기본 정보</SubTitle>
          <DetailCard>
            <SectionTitle>상세 정보</SectionTitle>
            <InfoRow label="이름" value={accountDetail?.accountName} />
            <InfoRow label="아이디" value={accountDetail?.email} />
            <InfoRow
              label="그룹"
              value={
                accountDetail?.groupName?.length
                  ? accountDetail.groupName.join(", ")
                  : undefined
              }
            />
            <InfoRow
              label="가입일"
              value={formatDateSafely(accountDetail?.createdAt)}
            />
            <Divider />
            <SectionTitle>워크스페이스 정보</SectionTitle>
            <InfoRow
              label="보유 개수"
              value={`${accountDetail?.workspaceCount ?? 0}개`}
            />
          </DetailCard>
        </section>

        {/* 계정 수정 정보 */}
        <section>
          <SubTitle>계정 수정 정보</SubTitle>

          <Form layout="vertical">
            {/* 권한, 상태 가로 배치 */}
            <FormRowHorizontal>
              <HalfFormItem>
                <Controller
                  name="accountRole"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label="권한"
                      required
                      help={errors.accountRole?.message}
                      validateStatus={errors.accountRole ? "error" : undefined}
                    >
                      <Dropdown
                        options={ACCOUNT_ROLE_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="권한 선택해 주세요."
                        width="100%"
                        status={errors.accountRole ? "error" : undefined}
                        disabled={isPending}
                      />
                    </FormItem>
                  )}
                />
              </HalfFormItem>
              <HalfFormItem>
                <Controller
                  name="isEnabled"
                  control={control}
                  render={({ field }) => (
                    <FormItem
                      label="상태"
                      required
                      help={errors.isEnabled?.message}
                      validateStatus={errors.isEnabled ? "error" : undefined}
                    >
                      <Dropdown
                        options={ACCOUNT_STATUS_OPTIONS}
                        value={getAccountStatusKeyFromBoolean(field.value)}
                        onChange={handleStatusChange(field.onChange)}
                        placeholder="상태 선택"
                        width="100%"
                        status={errors.isEnabled ? "error" : undefined}
                        disabled={isPending}
                      />
                    </FormItem>
                  )}
                />
              </HalfFormItem>
            </FormRowHorizontal>

            {/* 워크스페이스 생성 제한 개수 */}
            <Controller
              name="workspaceLimitCount"
              control={control}
              render={({ field }) => (
                <LastFormItem
                  label="워크스페이스 생성 제한 개수"
                  required
                  help={errors.workspaceLimitCount?.message}
                  validateStatus={
                    errors.workspaceLimitCount ? "error" : undefined
                  }
                >
                  <InputNumber
                    value={field.value}
                    onChange={field.onChange}
                    min={1}
                    suffix="개"
                    width="100%"
                    status={errors.workspaceLimitCount ? "error" : undefined}
                    disabled={isPending}
                  />
                </LastFormItem>
              )}
            />
          </Form>
        </section>
      </Container>
    </Modal>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  return (
    <DetailRow>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value || "-"}</DetailValue>
    </DetailRow>
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
  margin-bottom: 8px;


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

const LastFormItem = styled(FormItem)`
  && {
    margin-bottom: 0;
  }
`;
