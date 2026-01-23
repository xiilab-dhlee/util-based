"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Modal, Typography } from "xiilab-ui";

import { useGetStorageDetail } from "@/api/generated/admin-storage/admin-storage";
import { STORAGE_CHANNEL_LABEL } from "@/domain/storage/constants/storage.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ViewStorageDetailModalPayload {
  id: number;
}

export function ViewStorageDetailModal() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const publish = usePublish();

  const { data, isLoading, isError, refetch } = useGetStorageDetail(id ?? 0, {
    query: {
      enabled: id !== null,
    },
  });

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEdit = () => {
    if (!data) return;

    setOpen(false);
    publish(STORAGE_EVENTS.openEditModal, { data });
  };

  useSubscribe<ViewStorageDetailModalPayload>(
    STORAGE_EVENTS.openDetailModal,
    (payload) => {
      setId(payload.id);
      setOpen(true);
    },
  );

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
      okButtonProps={{ disabled: isLoading || isError || !data }}
      centered
      showHeaderBorder
      loading={isLoading}
    >
      {isError ? (
        <DataErrorState
          title="스토리지 정보를 불러올 수 없습니다."
          onRetry={refetch}
        />
      ) : (
        <Container>
          <DetailCard>
            <DetailRow>
              <DetailLabel>이름</DetailLabel>
              <DetailValue>{data?.storageName || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>타입</DetailLabel>
              <DetailValue>
                {data?.storageChannel
                  ? STORAGE_CHANNEL_LABEL[data?.storageChannel]
                  : "-"}
              </DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>IP 주소</DetailLabel>
              <DetailValue>{data?.storageIp || "-"}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>스토리지 저장 Path</DetailLabel>
              <DetailValue>{data?.storageSavePath || "-"}</DetailValue>
            </DetailRow>
          </DetailCard>
        </Container>
      )}
    </Modal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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

const DetailRow = styled.div`
  display: flex;
`;

const DetailLabel = styled(Typography.Text).attrs({
  variant: "body-2-2",
})`
  color: #484848;
  min-width: 110px;
  margin-right: 24px;
`;

const DetailValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  color: #000;
  word-break: break-all;
`;
