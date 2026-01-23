"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import {
  getGetStoragesQueryKey,
  useDeleteStorage,
} from "@/api/generated/admin-storage/admin-storage";
import { STORAGE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteStorageModalPayload {
  id: number;
}

/**
 * 스토리지 삭제 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 스토리지 ID를 전달받습니다.
 */
export function DeleteStorageModal() {
  const [open, setOpen] = useState(false);
  const [storageId, setStorageId] = useState<number | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useDeleteStorage();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    if (isPending) return;
    if (storageId === null) return;

    mutate(
      { storageId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetStoragesQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<DeleteStorageModalPayload>(
    STORAGE_EVENTS.openDeleteModal,
    (payload) => {
      setStorageId(payload.id ?? null);
      setOpen(true);
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleDelete}
      title="스토리지 삭제"
      centered
      okButtonProps={{
        loading: isPending,
      }}
      cancelButtonProps={{
        disabled: isPending,
      }}
    >
      <div>해당 스토리지를 삭제하시겠습니까?</div>
    </Modal>
  );
}
