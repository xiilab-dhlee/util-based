"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import { getAdminGetVolumeListQueryKey } from "@/api/generated/admin-volume/admin-volume";
import { getGetVolumeListQueryKey } from "@/api/generated/volume/volume";
import { useDeleteVolumesByMode } from "@/domain/volume/hooks/use-delete-volumes-by-mode";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteVolumeModalProps {
  mode: VolumeMode;
}

export function DeleteVolumeModal({ mode }: DeleteVolumeModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deleteVolumeIds, setDeleteVolumeIds] = useState<number[]>([]);

  const isUser = mode === "user";
  const { mutate, isPending } = useDeleteVolumesByMode(mode);

  const handleOk = () => {
    if (isPending) return;
    if (deleteVolumeIds.length === 0) return;

    mutate(
      { data: { volumeIds: deleteVolumeIds } },
      {
        onSuccess: () => {
          if (isUser) {
            queryClient.invalidateQueries({
              queryKey: getGetVolumeListQueryKey(),
            });
            router.replace(ROUTES.USER_VOLUME);
          } else {
            queryClient.invalidateQueries({
              queryKey: getAdminGetVolumeListQueryKey(),
            });
            router.replace(ROUTES.ADMIN_VOLUME);
          }
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<number[]>(VOLUME_EVENTS.openDeleteModal, (volumeIds) => {
    setDeleteVolumeIds(volumeIds);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="볼륨 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 볼륨을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 볼륨은 복구되지 않습니다.</div>
    </Modal>
  );
}
