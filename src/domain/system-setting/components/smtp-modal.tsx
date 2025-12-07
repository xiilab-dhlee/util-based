"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Box, Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { smtpKeys } from "@/domain/system-setting/constants/smtp.key";
import { useCreateSmtp } from "@/domain/system-setting/hooks/use-create-smtp";
import { useSmtpForm } from "@/domain/system-setting/hooks/use-smtp-form";
import { useUpdateSmtp } from "@/domain/system-setting/hooks/use-update-smtp";
import type {
  SmtpIdType,
  SmtpResponseType,
} from "@/domain/system-setting/schemas/smtp.schema";
import { GoogleIcon } from "@/shared/components/icon/google-icon";
import { MODAL_MODES, type ModalMode } from "@/shared/constants/core.constant";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export type SmtpModalPayload =
  | { mode: typeof MODAL_MODES.CREATE }
  | { mode: typeof MODAL_MODES.UPDATE; data: SmtpResponseType };

// ===== 컴포넌트 =====

/**
 * SMTP 등록/수정 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 데이터를 전달받습니다.
 */
export function SmtpModal() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>(MODAL_MODES.CREATE);
  const [editId, setEditId] = useState<SmtpIdType | null>(null);

  const {
    formState,
    errors,
    setField,
    setIsGoogle,
    validate,
    reset,
    initializeForEdit,
  } = useSmtpForm();

  // Mutations
  const createSmtp = useCreateSmtp();
  const updateSmtp = useUpdateSmtp();

  const isSubmitting = createSmtp.isPending || updateSmtp.isPending;

  // PubSub 구독 - SMTP 모달 열기 이벤트
  useSubscribe<SmtpModalPayload>(
    SYSTEM_SETTING_EVENTS.openSmtpModal,
    useCallback(
      (payload) => {
        setMode(payload.mode);
        if (payload.mode === MODAL_MODES.UPDATE && payload.data) {
          initializeForEdit(payload.data);
          setEditId(payload.data.id);
        } else {
          reset();
          setEditId(null);
        }
        setOpen(true);
      },
      [reset, initializeForEdit],
    ),
  );

  const handleCancel = () => {
    reset();
    setEditId(null);
    createSmtp.reset();
    updateSmtp.reset();
    setOpen(false);
  };

  const handleSubmit = () => {
    const payload = validate();
    if (!payload) return;

    const isUpdateMode = mode === MODAL_MODES.UPDATE;

    const onSuccess = () => {
      toast.success(
        isUpdateMode
          ? "SMTP 설정이 수정되었습니다."
          : "SMTP 설정이 등록되었습니다.",
      );
      queryClient.invalidateQueries({ queryKey: smtpKeys.default });
      handleCancel();
    };

    if (isUpdateMode && editId) {
      updateSmtp.mutate({ id: editId, ...payload }, { onSuccess });
    } else {
      createSmtp.mutate(payload, { onSuccess });
    }
  };

  if (!open) return null;

  const isUpdateMode = mode === MODAL_MODES.UPDATE;

  return (
    <Modal
      type="primary"
      icon={
        <Icon name={isUpdateMode ? "Edit01" : "Plus"} color="#fff" size={18} />
      }
      modalWidth={370}
      open={open}
      closable
      title={isUpdateMode ? "SMTP 수정" : "SMTP 등록"}
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText={isUpdateMode ? "수정" : "등록"}
      onOk={handleSubmit}
      confirmLoading={isSubmitting}
      centered
      showHeaderBorder
    >
      <Form layout="vertical">
        {/* 호스트 선택 */}
        <FormItem label="호스트" required>
          <HostButtonGroup>
            <Box
              state={formState.isGoogle ? "pressed" : "default"}
              onClick={() => setIsGoogle(true)}
              height="34px"
            >
              <HostButtonContent>
                <GoogleIcon />
                <span>Google</span>
              </HostButtonContent>
            </Box>
            <Box
              state={!formState.isGoogle ? "pressed" : "default"}
              onClick={() => setIsGoogle(false)}
              height="34px"
            >
              <HostButtonContent>
                <Icon name="Host" size={24} color="#404040" />
                <span>이외 호스트</span>
              </HostButtonContent>
            </Box>
          </HostButtonGroup>
        </FormItem>

        {/* Hub 선택 시 readonly 정보 표시 */}
        {formState.isGoogle && (
          <HostInfoBox>
            <HostInfoRow>
              <HostInfoLabel>SMTP 노드 주소</HostInfoLabel>
              <HostInfoValue>{formState.nodeAddress || "-"}</HostInfoValue>
            </HostInfoRow>
            <HostInfoRow>
              <HostInfoLabel>노드 포트 번호</HostInfoLabel>
              <HostInfoValue>{formState.nodePort || "-"}</HostInfoValue>
            </HostInfoRow>
          </HostInfoBox>
        )}

        {/* 이외 호스트 선택 시 입력 필드 */}
        {!formState.isGoogle && (
          <>
            <FormItem label="SMTP 노드 주소" required>
              <Input
                placeholder="SMTP 노드 주소를 입력해 주세요."
                value={formState.nodeAddress}
                onChange={(e) => setField("nodeAddress", e.target.value)}
                status={errors.nodeAddress ? "error" : undefined}
              />
            </FormItem>
            <FormItem label="노드 포트 번호" required>
              <Input
                placeholder="포트 번호를 입력해 주세요."
                value={formState.nodePort}
                onChange={(e) => setField("nodePort", e.target.value)}
                status={errors.nodePort ? "error" : undefined}
              />
            </FormItem>
            <Divider />
          </>
        )}

        {/* 계정 */}
        <FormItem label="계정" required>
          <Input
            type="email"
            placeholder="계정을 입력해 주세요."
            value={formState.account}
            onChange={(e) => setField("account", e.target.value)}
            status={errors.account ? "error" : undefined}
          />
        </FormItem>

        {/* 비밀번호 */}
        <FormItem label="비밀번호" required>
          <Input
            type="password"
            placeholder="비밀번호를 입력해 주세요."
            value={formState.password}
            onChange={(e) => setField("password", e.target.value)}
            status={errors.password ? "error" : undefined}
            width="100%"
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
