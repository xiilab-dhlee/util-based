"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, Typography } from "xiilab-ui";

import { useStorageUpdateForm } from "@/domain/system-setting/hooks/use-storage-setting-form";
import type { StorageSettingDetailType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface UpdateStorageModalPayload {
  data: StorageSettingDetailType;
}

// ===== 컴포넌트 =====

/**
 * 스토리지 수정 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 데이터를 전달받습니다.
 */
export function UpdateStorageModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<StorageSettingDetailType | null>(null);
  const { formState, errors, setField, initializeForEdit, validate, reset } =
    useStorageUpdateForm();

  // PubSub 구독 - 스토리지 수정 모달 열기 이벤트
  useSubscribe<UpdateStorageModalPayload>(
    SYSTEM_SETTING_EVENTS.openStorageEditModal,
    useCallback(
      (payload) => {
        setData(payload.data);
        initializeForEdit(payload.data);
        setOpen(true);
      },
      [initializeForEdit],
    ),
  );

  const handleCancel = () => {
    reset();
    setOpen(false);
    setData(null);
  };

  const handleSubmit = () => {
    const payload = validate();
    if (!payload) {
      return;
    }

    // TODO: 스토리지 수정 API 연동
  };

  if (!open || !data) return null;

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="스토리지 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="수정 완료"
      onOk={handleSubmit}
      centered
      showHeaderBorder
    >
      <ModalContent>
        <SectionGroup>
          {/* 스토리지 기본 정보 섹션 */}
          <SectionHeader>
            <SectionIndicator />
            <SectionTitle>스토리지 기본 정보</SectionTitle>
          </SectionHeader>

          <ContentBox>
            <InfoRow>
              <Label>타입</Label>
              <Value>{data.storageType}</Value>
            </InfoRow>
            <InfoRow>
              <Label>IP 주소</Label>
              <Value>{data.ip}</Value>
            </InfoRow>
            <InfoRow>
              <Label>스토리지 저장 Path</Label>
              <Value>{data.path}</Value>
            </InfoRow>
          </ContentBox>
        </SectionGroup>

        <SectionGroup>
          {/* 스토리지 수정 정보 섹션 */}
          <SectionHeader>
            <SectionIndicator />
            <SectionTitle>스토리지 수정 정보</SectionTitle>
          </SectionHeader>

          <Form layout="vertical">
            <FormItem label="이름" required>
              <Input
                placeholder="스토리지 이름을 입력해 주세요."
                value={formState.storageName}
                onChange={(e) => setField("storageName", e.target.value)}
                status={errors.storageName ? "error" : undefined}
              />
            </FormItem>
          </Form>
        </SectionGroup>
      </ModalContent>
    </Modal>
  );
}

// ===== Styled Components =====

const ModalContent = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
`;

const SectionIndicator = styled.div`
  width: 2px;
  height: 12px;
  background-color: rgba(31, 91, 255, 0.8);
`;

const SectionTitle = styled(Typography.Text).attrs({
  variant: "body-2-1",
})`
  color: #000;
  font-weight: 700;
`;

const ContentBox = styled.div`
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;

  & + & {
    margin-top: 12px;
  }
`;

const Label = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  min-width: 100px;
  color: #484848;
  font-weight: 600;
`;

const Value = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  flex: 1;
  word-break: break-all;
  white-space: normal;
`;
