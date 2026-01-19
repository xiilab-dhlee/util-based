"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetVolumeListQueryKey,
  useDeleteVolume,
} from "@/api/generated/volume/volume";
import { openDeleteVolumeModalAtom } from "@/domain/volume/state/volume.atom";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

export function DeleteVolumeModal() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { open, onOpen, onClose } = useGlobalModal(openDeleteVolumeModalAtom);

  const [deleteVolumeIds, setDeleteVolumeIds] = useState<number[]>([]);
  const deleteVolume = useDeleteVolume();

  const isUser = isUserMode(pathname);

  const handleOk = async () => {
    if (deleteVolume.isPending) return;
    if (deleteVolumeIds.length === 0) return;

    for (const volumeId of deleteVolumeIds) {
      await deleteVolume.mutateAsync({ volumeId });
    }
    toast.success("볼륨 삭제 성공");
    onClose();
    queryClient.invalidateQueries({
      queryKey: getGetVolumeListQueryKey(),
    });

    const targetRoute = isUser ? ROUTES.USER_VOLUME : ROUTES.ADMIN_VOLUME;
    router.replace(targetRoute);
  };

  const handleCancel = () => {
    if (deleteVolume.isPending) return;
    onClose();
  };

  useSubscribe<number[]>(VOLUME_EVENTS.sendDeleteVolume, (volumeIds) => {
    setDeleteVolumeIds(volumeIds);
    onOpen();
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
      okButtonProps={{
        loading: deleteVolume.isPending,
      }}
      cancelButtonProps={{
        disabled: deleteVolume.isPending,
      }}
    >
      <div>선택한 볼륨을 삭제하시겠습니까?</div>
      <div>삭제 시 해당 볼륨은 복구되지 않습니다.</div>
    </Modal>
  );
}
