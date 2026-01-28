"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { useGetStorageDetail } from "@/api/generated/admin-storage/admin-storage";
import { STORAGE_CHANNEL_LABEL } from "@/domain/storage/constants/storage.constant";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish, useSubscribe } from "@/shared/hooks/use-pub-sub";
import {
  ModalDetailCard,
  ModalDetailContainer,
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailValue,
} from "@/styles/layers/modal-detail-layers.styled";

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
        <ModalDetailContainer>
          <ModalDetailCard>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="110px">이름</ModalDetailLabel>
              <ModalDetailValue>{data?.storageName || "-"}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="110px">타입</ModalDetailLabel>
              <ModalDetailValue>
                {data?.storageChannel
                  ? STORAGE_CHANNEL_LABEL[data?.storageChannel]
                  : "-"}
              </ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="110px">IP 주소</ModalDetailLabel>
              <ModalDetailValue>{data?.storageIp || "-"}</ModalDetailValue>
            </ModalDetailRow>
            <ModalDetailRow>
              <ModalDetailLabel $minWidth="110px">
                스토리지 저장 Path
              </ModalDetailLabel>
              <ModalDetailValue>
                {data?.storageSavePath || "-"}
              </ModalDetailValue>
            </ModalDetailRow>
          </ModalDetailCard>
        </ModalDetailContainer>
      )}
    </Modal>
  );
}
