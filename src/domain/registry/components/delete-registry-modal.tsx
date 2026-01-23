"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import { getGetPrivateRegistryListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicRegistryListQueryKey } from "@/api/generated/public-registry/public-registry";
import { useDeleteRegistryByMode } from "@/domain/registry/hooks/use-delete-registry-by-mode";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteRegistryModalProps {
  mode: RegistryMode;
}

/**
 * 레지스트리 이미지 삭제 모달
 *
 * Note: 현재 public 삭제 API가 없으므로 private 동작만 지원됩니다.
 * public API가 추가되면 use-delete-registry-by-mode.ts의 TODO 주석을 참고하세요.
 */
export function DeleteRegistryModal({ mode }: DeleteRegistryModalProps) {
  const [open, setOpen] = useState(false);
  const [deleteRegistries, setDeleteRegistries] = useState<string[]>([]);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useDeleteRegistryByMode(mode);

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  const handleOk = () => {
    if (isPending) return;
    if (deleteRegistries.length === 0) return;

    mutate(
      {
        data: { harborImageNames: deleteRegistries },
      },
      {
        onSuccess: () => {
          if (mode === "private") {
            queryClient.invalidateQueries({
              queryKey: getGetPrivateRegistryListQueryKey(),
            });
          } else if (mode === "public") {
            queryClient.invalidateQueries({
              queryKey: getGetPublicRegistryListQueryKey(),
            });
          }
          setOpen(false);
        },
      },
    );
  };

  useSubscribe<string[]>(REGISTRY_EVENTS.openDeleteModal, (registries) => {
    setDeleteRegistries(registries);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="레지스트리 이미지 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 레지스트리 이미지와 포함된 태그를</div>
      <div>모두 삭제하시겠습니까?</div>
    </Modal>
  );
}
