"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { Icon, Modal } from "xiilab-ui";

import {
  getGetPrivateImageTagListQueryKey,
  useScanPrivateImageTag,
} from "@/api/generated/private-registry/private-registry";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface ScanTagPayload {
  harborImageName: string;
  tagName: string;
}

export function ScanPrivateRegistryTagModal() {
  const [open, setOpen] = useState(false);
  const [harborImageName, setHarborImageName] = useState<string | null>(null);
  const [tagName, setTagName] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useScanPrivateImageTag();

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
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          toast.success("취약점 스캔이 시작되었습니다.");
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<ScanTagPayload>(
    PRIVATE_REGISTRY_EVENTS.openScanTagModal,
    (data) => {
      setHarborImageName(data.harborImageName);
      setTagName(data.tagName);
      setOpen(true);
    },
  );

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
