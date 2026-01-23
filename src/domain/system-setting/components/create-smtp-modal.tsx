"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import styled from "styled-components";
import { Box, Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { getGetSmtpSetQueryKey } from "@/api/generated/smtp-settings/smtp-settings";
import { useRegisterSmtpSet } from "@/api/generated/smtp-settings-admin/smtp-settings-admin";
import { GOOGLE_SMTP_CONFIG } from "@/domain/system-setting/constants/system-setting.constant";
import {
  type SmtpFormType,
  smtpFormSchema,
} from "@/domain/system-setting/schemas/smtp.schema";
import { GoogleIcon } from "@/shared/components/icon/google-icon";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

/**
 * SMTP 등록 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 데이터를 전달받습니다.
 */
export function CreateSmtpModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SmtpFormType>({
    resolver: zodResolver(smtpFormSchema),
    defaultValues: {
      isGoogle: true,
      host: GOOGLE_SMTP_CONFIG.host,
      hostPort: GOOGLE_SMTP_CONFIG.hostPort,
      email: "",
      password: "",
    },
  });

  const isGoogle = useWatch({ control, name: "isGoogle" });

  const { mutate, isPending } = useRegisterSmtpSet();

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const onSubmit = (data: SmtpFormType) => {
    if (isPending) return;

    mutate(
      {
        data: {
          host: data.host,
          hostPort: Number(data.hostPort),
          email: data.email,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: getGetSmtpSetQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  // isGoogle 변경 시 host, hostPort 자동 설정
  useEffect(() => {
    if (isGoogle) {
      setValue("host", GOOGLE_SMTP_CONFIG.host);
      setValue("hostPort", GOOGLE_SMTP_CONFIG.hostPort);
    } else {
      setValue("host", "");
      setValue("hostPort", "");
    }
  }, [isGoogle, setValue]);

  useSubscribe(SYSTEM_SETTING_EVENTS.openCreateSmtpModal, () => {
    reset();
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      title="SMTP 등록"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="등록"
      onOk={handleSubmit(onSubmit)}
      confirmLoading={isPending}
      centered
      showHeaderBorder
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <Form layout="vertical">
        {/* 호스트 선택 */}
        <FormItem label="호스트" required>
          <Controller
            name="isGoogle"
            control={control}
            render={({ field }) => (
              <HostButtonGroup>
                <Box
                  state={field.value ? "pressed" : "default"}
                  onClick={() => field.onChange(true)}
                  height="34px"
                >
                  <HostButtonContent>
                    <GoogleIcon />
                    <span>Google</span>
                  </HostButtonContent>
                </Box>
                <Box
                  state={!field.value ? "pressed" : "default"}
                  onClick={() => field.onChange(false)}
                  height="34px"
                >
                  <HostButtonContent>
                    <Icon name="Host" size={24} color="#404040" />
                    <span>이외 호스트</span>
                  </HostButtonContent>
                </Box>
              </HostButtonGroup>
            )}
          />
        </FormItem>

        {/* Google 선택 시 readonly 정보 표시 */}
        {isGoogle && (
          <HostInfoBox>
            <HostInfoRow>
              <HostInfoLabel>SMTP 호스트 주소</HostInfoLabel>
              <HostInfoValue>{GOOGLE_SMTP_CONFIG.host}</HostInfoValue>
            </HostInfoRow>
            <HostInfoRow>
              <HostInfoLabel>포트 번호</HostInfoLabel>
              <HostInfoValue>{GOOGLE_SMTP_CONFIG.hostPort}</HostInfoValue>
            </HostInfoRow>
          </HostInfoBox>
        )}

        {/* 이외 호스트 선택 시 입력 필드 */}
        {!isGoogle && (
          <>
            <FormItem
              label="SMTP 호스트 주소"
              required
              validateStatus={errors.host ? "error" : undefined}
              help={errors.host?.message}
            >
              <Controller
                name="host"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="SMTP 호스트 주소를 입력해 주세요."
                    status={errors.host ? "error" : undefined}
                    disabled={isPending}
                    autoComplete="off"
                  />
                )}
              />
            </FormItem>
            <FormItem
              label="포트 번호"
              required
              validateStatus={errors.hostPort ? "error" : undefined}
              help={errors.hostPort?.message}
            >
              <Controller
                name="hostPort"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    placeholder="포트 번호를 입력해 주세요."
                    status={errors.hostPort ? "error" : undefined}
                    disabled={isPending}
                    autoComplete="off"
                  />
                )}
              />
            </FormItem>
            <Divider />
          </>
        )}

        {/* 계정 */}
        <FormItem
          label="계정"
          required
          validateStatus={errors.email ? "error" : undefined}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                placeholder="계정을 입력해 주세요."
                status={errors.email ? "error" : undefined}
                disabled={isPending}
                autoComplete="off"
              />
            )}
          />
        </FormItem>

        {/* 비밀번호 */}
        <FormItem
          label="비밀번호"
          required
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="password"
                placeholder="비밀번호를 입력해 주세요."
                status={errors.password ? "error" : undefined}
                disabled={isPending}
                autoComplete="off"
                width="100%"
              />
            )}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

// ===== Styled Components =====

const HostButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const HostInfoBox = styled.div`
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;
  margin-bottom: 12px;
`;

const HostInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  & + & {
    margin-top: 12px;
  }
`;

const HostInfoLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  font-weight: 600;
  min-width: 90px;
`;

const HostInfoValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
`;

const HostButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 100%;
  font-size: 12px;
  font-weight: 500;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e9e9e9;
  margin: 12px 0;
`;
