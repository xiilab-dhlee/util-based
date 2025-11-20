"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Icon, Input, Modal } from "xiilab-ui";

import { useCreateVolumeFolder } from "@/domain/volume/hooks/use-create-volume-folder";
import { openCreateVolumeFolderModalAtom } from "@/domain/volume/state/volume.atom";
import type { CreateVolumeFolderPayload } from "@/domain/volume/types/volume.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormItem } from "@/styles/layers/form-layer.styled";

export function CreateVolumeFolderModal() {
  const formRef = useRef<HTMLFormElement>(null);
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateVolumeFolderModalAtom,
  );
  // 압축할 파일 경로 목록
  const [filePath, setFilePath] = useState<string>("");

  const createVolumeFolder = useCreateVolumeFolder();

  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      createVolumeFolder.mutate(payload, {
        onSuccess: () => {
          toast.success("볼륨 폴더 추가 성공");
          onClose();
        },
      });
    }
  };

  const createPayload = (): CreateVolumeFolderPayload | null => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);

    return {
      path: filePath,
      folderName: formData.get("volumeFolderName") as string,
    };
  };

  useSubscribe(
    VOLUME_EVENTS.sendCreateVolumeFolder,
    (eventData: { filePath: string }) => {
      setFilePath(eventData.filePath);
      onOpen();
    },
  );

  return (
    <Modal
      modalWidth={370}
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={18} />}
      open={open}
      closable
      title="폴더 추가"
      onCancel={onClose}
      showCancelButton
      cancelText="취소"
      okText="추가"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef}>
        {/* 마운트 경로 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="volumeFolderName">
            폴더를 추가하시겠습니까?
          </FormLabel>
          <Input
            type="text"
            id="volumeFolderName"
            name="volumeFolderName"
            placeholder="새로 생성할 폴더명을 입력해주세요."
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}
