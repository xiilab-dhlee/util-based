"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Modal } from "xiilab-ui";

import { storageSettingKeys } from "@/domain/system-setting/constants/storage-setting.key";
import { useDeleteStorage } from "@/domain/system-setting/hooks/use-delete-storage";
import type { StorageSettingIdType } from "@/domain/system-setting/schemas/storage-setting.schema";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

// ===== 타입 =====

export interface DeleteStorageModalPayload {
  id: StorageSettingIdType;
}

/**
 * 스토리지 삭제 모달
 *
 * PubSub 패턴을 사용하여 모달을 열고 스토리지 ID를 전달받습니다.
 */
export function DeleteStorageModal() {
  const [open, setOpen] = useState(false);
  const [storageId, setStorageId] = useState<StorageSettingIdType | null>(null);

  const queryClient = useQueryClient();
  const deleteStorage = useDeleteStorage();

  // PubSub 구독 - 스토리지 삭제 모달 열기 이벤트
  useSubscribe<DeleteStorageModalPayload>(
    SYSTEM_SETTING_EVENTS.openStorageDeleteModal,
    useCallback((payload) => {
      setStorageId(payload.id);
      setOpen(true);
    }, []),
  );

  const handleCancel = () => {
    setOpen(false);
    setStorageId(null);
  };

  const handleDelete = () => {
    if (storageId === null) return;

    deleteStorage.mutate(storageId, {
      onSuccess: () => {
        // 스토리지 목록 데이터 갱신
        queryClient.invalidateQueries({
          queryKey: storageSettingKeys.default,
        });
        handleCancel();
      },
    });
  };

  if (!open) return null;

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
        loading: deleteStorage.isPending,
      }}
    >
      <div>해당 스토리지를 삭제하시겠습니까?</div>
    </Modal>
  );
}
