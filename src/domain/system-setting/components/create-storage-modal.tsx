"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Dropdown, Form, FormItem, Icon, Input, Modal } from "xiilab-ui";

import { STORAGE_TYPE_OPTIONS } from "@/domain/system-setting/constants/system-setting.constant";
import { useStorageCreateForm } from "@/domain/system-setting/hooks/use-storage-setting-form";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export type CreateStorageModalPayload = Record<string, never>;

// ===== 상수 =====

// ===== 컴포넌트 =====

/**
 * 스토리지 추가 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 폼 입력을 처리합니다.
 */
export function CreateStorageModal() {
  const [open, setOpen] = useState(false);
  const { formState, errors, setField, validate, reset } =
    useStorageCreateForm();

  // PubSub 구독 - 스토리지 추가 모달 열기 이벤트
  useSubscribe<CreateStorageModalPayload>(
    SYSTEM_SETTING_EVENTS.openStorageCreateModal,
    useCallback(() => {
      reset();
      setOpen(true);
    }, [reset]),
  );

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const handleSubmit = () => {
    const payload = validate();
    if (!payload) {
      return;
    }

    // TODO: 스토리지 추가 API 연동
    handleCancel();
  };

  if (!open) return null;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="스토리지 추가"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="추가"
      onOk={handleSubmit}
      centered
      showHeaderBorder
    >
      <Form layout="vertical">
        <FormRow>
          <FormCol>
            <FormItem label="이름" required>
              <Input
                placeholder="이름을 입력해 주세요."
                value={formState.storageName}
                onChange={(e) => setField("storageName", e.target.value)}
                status={errors.storageName ? "error" : undefined}
              />
            </FormItem>
          </FormCol>
          <FormCol>
            <FormItem label="타입" required>
              <Dropdown
                placeholder="타입을 선택해 주세요."
                options={STORAGE_TYPE_OPTIONS}
                value={formState.storageType}
                onChange={(value) => setField("storageType", String(value))}
                status={errors.storageType ? "error" : undefined}
                width="100%"
              />
            </FormItem>
          </FormCol>
        </FormRow>
        <FormItem label="IP 주소" required>
          <Input
            placeholder="IP 주소를 입력해 주세요."
            value={formState.ip}
            onChange={(e) => setField("ip", e.target.value)}
            status={errors.ip ? "error" : undefined}
          />
        </FormItem>
        <FormItem label="스토리지 저장 Path" required>
          <Input
            placeholder="Path를 입력해 주세요. 예) /root/code/123"
            value={formState.path}
            onChange={(e) => setField("path", e.target.value)}
            status={errors.path ? "error" : undefined}
          />
        </FormItem>
      </Form>
    </Modal>
  );
}

// ===== Styled Components =====

const FormRow = styled.div`
  display: flex;
  gap: 8px;
`;

const FormCol = styled.div`
  flex: 1;
`;
