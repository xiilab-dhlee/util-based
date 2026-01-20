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
  const [scanData, setScanData] = useState<ScanTagPayload | null>(null);

  const queryClient = useQueryClient();

  const { mutate: scanImageTag, isPending } = useScanPrivateImageTag();

  const handleOk = () => {
    if (!scanData) {
      toast.error("스캔할 태그 정보가 없습니다.");
      return;
    }

    if (isPending) {
      return;
    }

    scanImageTag(
      {
        data: {
          harborImageName: scanData.harborImageName,
          tagName: scanData.tagName,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getGetPrivateImageTagListQueryKey(),
          });
          setOpen(false);
          toast.success("취약점 스캔이 시작되었습니다.");
        },
      },
    );
  };

  const handleClose = () => {
    if (isPending) return;
    setOpen(false);
    setScanData(null);
  };

  useSubscribe<ScanTagPayload>(
    PRIVATE_REGISTRY_EVENTS.sendScanTagData,
    (data) => {
      setScanData(data);
      setOpen(true);
    },
  );

  return (
    <Modal
      type="primary"
      modalWidth={300}
      icon={<Icon name="SecurityCheck" color="#fff" size={18} />}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      okText="검증"
      cancelText="취소"
      title="태그 취약점 검증"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
    >
      <div>선택한 태그에 대한 취약점 검증을 진행하시겠습니까?</div>
    </Modal>
  );
}
