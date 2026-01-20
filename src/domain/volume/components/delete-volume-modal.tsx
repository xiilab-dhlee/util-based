"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import {
  getGetVolumeListQueryKey,
  useDeleteVolume,
} from "@/api/generated/volume/volume";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

export function DeleteVolumeModal() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deleteVolumeIds, setDeleteVolumeIds] = useState<number[]>([]);
  const { mutateAsync, isPending } = useDeleteVolume();

  const isUser = isUserMode(pathname);

  const handleOk = async () => {
    if (isPending) return;
    if (deleteVolumeIds.length === 0) return;

    for (const volumeId of deleteVolumeIds) {
      await mutateAsync({ volumeId });
    }

    queryClient.invalidateQueries({
      queryKey: getGetVolumeListQueryKey(),
    });
    setOpen(false);

    const targetRoute = isUser ? ROUTES.USER_VOLUME : ROUTES.ADMIN_VOLUME;
    router.replace(targetRoute);
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
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 볼륨을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 볼륨은 복구되지 않습니다.</div>
    </Modal>
  );
}
