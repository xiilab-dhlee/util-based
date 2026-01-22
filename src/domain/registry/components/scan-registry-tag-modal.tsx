"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { getGetPrivateImageTagListQueryKey } from "@/api/generated/private-registry/private-registry";
import { getGetPublicImageTagListQueryKey } from "@/api/generated/public-registry/public-registry";
import { useScanRegistryTagByMode } from "@/domain/registry/hooks/use-scan-registry-tag-by-mode";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ScanTagPayload {
  harborImageName: string;
  tagName: string;
}

interface ScanRegistryTagModalProps {
  mode: RegistryMode;
}

export function ScanRegistryTagModal({ mode }: ScanRegistryTagModalProps) {
  const [open, setOpen] = useState(false);
  const [harborImageName, setHarborImageName] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useScanRegistryTagByMode(mode);

  const handleOk = () => {
    if (isPending) return;

    if (!harborImageName || !tagName) return;

    mutate(
      {
        data: {
          harborImageName,
          tagName,
        },
      },
      {
        onSuccess: () => {
          // private/public 캐시 모두 무효화
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          queryClient.invalidateQueries({
            queryKey: getGetPublicImageTagListQueryKey(),
          });
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<ScanTagPayload>(REGISTRY_EVENTS.openScanTagModal, (data) => {
    setHarborImageName(data.harborImageName);
    setTagName(data.tagName);
    setOpen(true);
  });

  return (
    <Modal
      type="primary"
      modalWidth={300}
      icon={<Icon name="SecurityCheck" color="#fff" size={18} />}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="검증"
      cancelText="취소"
      title="태그 취약점 검증"
      centered
      closable
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 태그에 대한 취약점 검증을 진행하시겠습니까?</div>
    </Modal>
  );
}
