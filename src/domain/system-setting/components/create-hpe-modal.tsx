"use client";

import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Form, Icon, Input, Modal } from "xiilab-ui";

import { useGetHpe } from "@/domain/system-setting/hooks/use-get-hpe";
import { useHpeForm } from "@/domain/system-setting/hooks/use-hpe-form";
import { useUpdateHpe } from "@/domain/system-setting/hooks/use-update-hpe";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { errorTextStyle } from "@/styles/mixins/text";

/**
 * HPE OneView 연동 모달
 * ID, 비밀번호, Server IP 입력 및 연동
 */
export function CreateHpeModal() {
  const [open, setOpen] = useState(false);
  const { data: hpeData } = useGetHpe();
  const updateMutation = useUpdateHpe();
  const { formState, errors, setField, validate, reset, setInitialData } =
    useHpeForm();

  // PubSub 구독: 모달 열기 이벤트
  useSubscribe(
    SYSTEM_SETTING_EVENTS.openHpeConnectionModal,
    useCallback(() => {
      reset();
      setOpen(true);
    }, [reset]),
  );

  // 모달이 열릴 때 기존 데이터가 있으면 폼에 채우기 (수정 모드)
  useEffect(() => {
    if (open && hpeData) {
      setInitialData({
        id: hpeData.id,
        serverIp: hpeData.serverIp,
      });
    }
  }, [open, hpeData, setInitialData]);

  const handleCancel = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  const handleSubmit = () => {
    const payload = validate();
    if (payload) {
      updateMutation.mutate(payload);
      setOpen(false);
      reset();
    }
  };

  const handleIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("id", e.target.value);
    },
    [setField],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("password", e.target.value);
    },
    [setField],
  );

  const handleServerIpChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setField("serverIp", e.target.value);
    },
    [setField],
  );

  return (
    <Modal
      open={open}
      type="primary"
      icon={<Icon name="Port" color="#fff" size={18} />}
      modalWidth={370}
      closable
      title="HPE One View 연동"
      centered
      showHeaderBorder
      okText="확인"
      onOk={handleSubmit}
      cancelText="취소"
      onCancel={handleCancel}
      okButtonProps={{
        disabled: updateMutation.isPending,
        loading: updateMutation.isPending,
      }}
    >
      <Form>
        {/* Server IP */}
        <Form.Item
          label="Server IP"
          required
          validateStatus={errors.serverIp ? "error" : undefined}
        >
          <FormItemWrapper>
            {errors.serverIp && <ErrorText>{errors.serverIp}</ErrorText>}
            <Input
              placeholder="192.168.1.100"
              value={formState.serverIp}
              onChange={handleServerIpChange}
              disabled={updateMutation.isPending}
              width="100%"
            />
          </FormItemWrapper>
        </Form.Item>

        {/* ID */}
        <Form.Item
          label="ID"
          required
          validateStatus={errors.id ? "error" : undefined}
        >
          <FormItemWrapper>
            {errors.id && <ErrorText>{errors.id}</ErrorText>}
            <Input
              placeholder="ID를 입력해 주세요."
              value={formState.id}
              onChange={handleIdChange}
              disabled={updateMutation.isPending}
              width="100%"
            />
          </FormItemWrapper>
        </Form.Item>

        {/* 비밀번호 */}
        <Form.Item
          label="비밀번호"
          required
          validateStatus={errors.password ? "error" : undefined}
        >
          <FormItemWrapper>
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              value={formState.password}
              onChange={handlePasswordChange}
              disabled={updateMutation.isPending}
              width="100%"
            />
          </FormItemWrapper>
        </Form.Item>
      </Form>
    </Modal>
  );
}

const FormItemWrapper = styled.div`
  position: relative;
`;

const ErrorText = styled.span`
  ${errorTextStyle}
  position: absolute;
  top: -22px;
  right: 0;
  z-index: 10;
  pointer-events: none;
`;
