"use client";

import { useCallback, useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import type { StorageSettingDetailType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface ViewStorageModalPayload {
  data: StorageSettingDetailType;
}

// ===== 컴포넌트 =====

/**
 * 스토리지 상세 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 데이터를 전달받습니다.
 * 수정 버튼 클릭 시 수정 모달을 엽니다.
 */
export function ViewStorageModal() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<StorageSettingDetailType | null>(null);
  const publish = usePublish();

  // PubSub 구독 - 스토리지 상세 모달 열기 이벤트
  useSubscribe<ViewStorageModalPayload>(
    SYSTEM_SETTING_EVENTS.openStorageDetailModal,
    useCallback((payload) => {
      setData(payload.data);
      setOpen(true);
    }, []),
  );

  const handleCancel = () => {
    setOpen(false);
    setData(null);
  };

  const handleEdit = () => {
    if (!data) return;
    // 상세 모달 닫고 수정 모달 열기
    setOpen(false);
    publish(SYSTEM_SETTING_EVENTS.openStorageEditModal, { data });
  };

  if (!open || !data) return null;

  return (
    <Modal
      type="primary"
      icon={<Icon name="OnPremiseStorage" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="스토리지 상세"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="수정"
      onOk={handleEdit}
      centered
      showHeaderBorder
    >
      <ContentBox>
        <InfoRow>
          <Label>이름</Label>
          <Value>{data.storageName}</Value>
        </InfoRow>
        <InfoRow>
          <Label>타입</Label>
          <Value>{data.storageType}</Value>
        </InfoRow>
        <InfoRow>
          <Label>IP 주소</Label>
          <Value>{data.ip}</Value>
        </InfoRow>
        <InfoRow>
          <Label>스토리지 저장 PATH</Label>
          <Value>{data.path}</Value>
        </InfoRow>
      </ContentBox>
    </Modal>
  );
}

// ===== Styled Components =====

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
