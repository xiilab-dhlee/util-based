"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Input, Modal, TextArea } from "xiilab-ui";

import {
  closeUpdateWorkspaceModalAtom,
  openUpdateWorkspaceModalAtom,
  updateWorkspaceModalDataAtom,
} from "@/atoms/workspace/workspace-modal.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icon";
import { useUpdateWorkspace } from "@/hooks/workspace/use-update-workspace";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type { UpdateWorkspacePayload } from "@/types/workspace/workspace.interface";

/**
 * ?�크?�페?�스 ?�정 모달 컴포?�트
 *
 * ?�크?�페?�스???�름�??�명???�정?????�는 모달?�니??
 * ?�정 ?�이지?�서 ?�용?�는 모달?�니??
 */
export function UpdateWorkspaceModal() {
  // 모달 ?�태 관�?
  const [open] = useAtom(openUpdateWorkspaceModalAtom);
  const [modalData] = useAtom(updateWorkspaceModalDataAtom);
  const closeModal = useSetAtom(closeUpdateWorkspaceModalAtom);

  // ???�태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const updateWorkspace = useUpdateWorkspace();

  // 모달???�릴 ???�이?��? ?�에 ?�정
  useEffect(() => {
    if (modalData) {
      setName(modalData.name);
      setDescription(modalData.description || "");
    }
  }, [modalData]);

  /**
   * ???�출 처리 ?�수
   *
   * ?�크?�페?�스 ?�정 ?�이?��? ?�버�??�송?�고 모달???�습?�다.
   */
  const handleSubmit = () => {
    if (!modalData?.id || !name.trim()) {
      toast.error("?�크?�페?�스 ?�름???�력?�주?�요.");
      return;
    }

    const payload: UpdateWorkspacePayload = {
      id: modalData.id,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    updateWorkspace.mutate(payload, {
      onSuccess: () => {
        toast.success("?�크?�페?�스 ?�정???�료?�었?�니??");
        closeModal();
        // ???�태 초기??
        setName("");
        setDescription("");
      },
      onError: (error) => {
        toast.error("?�크?�페?�스 ?�정???�패?�습?�다.");
        console.error("Workspace update error:", error);
      },
    });
  };

  /**
   * 모달 ?�기 처리 ?�수
   */
  const handleCancel = () => {
    closeModal();
    // ???�태 초기??
    setName("");
    setDescription("");
  };

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="?�크?�페?�스 ?�정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="?�정 ?�료"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateWorkspace.isPending,
        loading: updateWorkspace.isPending,
      }}
    >
      <form>
        {/* ?�크?�페?�스 ?�름 ?�력 ?�드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkspaceName">?�크?�페?�스 ?�름</FormLabel>
          <Input
            type="text"
            id="updateWorkspaceName"
            placeholder="?�크?�페?�스 ?�름???�력??주세??"
            value={name}
            onChange={(e) => setName(e.target.value)}
            width="100%"
          />
        </FormItem>

        {/* ?�크?�페?�스 ?�명 ?�력 ?�드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkspaceDescription">
            ?�크?�페?�스 ?�명
          </FormLabel>
          <TextArea
            id="updateWorkspaceDescription"
            placeholder="Infra Core 모델?�서 ?�용??WorkSpace?�니?? yolov5, yolov8 Detect model???�용???�구�?진행?�니?? AI Model ?�습???�한 ?�크?�페?�스?�니??"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </FormItem>
      </form>
    </Modal>
  );
}
