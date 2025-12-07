"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { Icon, Input, Modal } from "xiilab-ui";

import { useCreateWorkloadFolder } from "@/domain/workload/hooks/use-create-workload-folder";
import { openCreateWorkloadFolderModalAtom } from "@/domain/workload/state/workload.atom";
import type { CreateWorkloadFolderPayload } from "@/domain/workload/types/workload.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { WORKLOAD_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { FormItem } from "@/styles/layers/form-layer.styled";

export function CreateWorkloadFolderModal() {
  const formRef = useRef<HTMLFormElement>(null);
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openCreateWorkloadFolderModalAtom,
  );
  // 워크로드 정보
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [workloadId, setWorkloadId] = useState<string>("");
  const [filePath, setFilePath] = useState<string>("");

  const createWorkloadFolder = useCreateWorkloadFolder();

  const handleSubmit = () => {
    const payload = createPayload();

    if (payload) {
      createWorkloadFolder.mutate(payload, {
        onSuccess: () => {
          toast.success("워크로드 폴더 추가 성공");
          onClose();
        },
      });
    }
  };

  const createPayload = (): CreateWorkloadFolderPayload | null => {
    if (!formRef.current) return null;
    const formData = new FormData(formRef.current);

    return {
      workspaceId,
      workloadId,
      path: filePath,
      folderName: formData.get("workloadFolderName") as string,
    };
  };

  useSubscribe(
    WORKLOAD_EVENTS.sendCreateWorkloadFolder,
    (eventData: {
      workspaceId: string;
      workloadId: string;
      filePath: string;
    }) => {
      setWorkspaceId(eventData.workspaceId);
      setWorkloadId(eventData.workloadId);
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
        {/* 폴더명 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="workloadFolderName">
            폴더를 추가하시겠습니까?
          </FormLabel>
          <Input
            type="text"
            id="workloadFolderName"
            name="workloadFolderName"
            placeholder="새로 생성할 폴더명을 입력해주세요."
            width="100%"
          />
        </FormItem>
      </form>
    </Modal>
  );
}
