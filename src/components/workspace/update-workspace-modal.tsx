"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Icon, Input, Modal, TextArea } from "xiilab-ui";

import {
  closeUpdateWorkspaceModalAtom,
  openUpdateWorkspaceModalAtom,
  updateWorkspaceModalDataAtom,
} from "@/atoms/workspace/workspace-modal.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { useUpdateWorkspace } from "@/hooks/workspace/use-update-workspace";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type { UpdateWorkspacePayload } from "@/types/workspace/workspace.interface";

/**
 * 워크스페이스 수정 모달 컴포넌트
 *
 * 워크스페이스의 이름과 설명을 수정할 수 있는 모달입니다.
 * 설정 페이지에서 사용되는 모달입니다.
 */
function UpdateWorkspaceModal() {
  // 모달 상태 관리
  const [open] = useAtom(openUpdateWorkspaceModalAtom);
  const [modalData] = useAtom(updateWorkspaceModalDataAtom);
  const closeModal = useSetAtom(closeUpdateWorkspaceModalAtom);

  // 폼 상태
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const updateWorkspace = useUpdateWorkspace();

  // 모달이 열릴 때 데이터를 폼에 설정
  useEffect(() => {
    if (modalData) {
      setName(modalData.name);
      setDescription(modalData.description || "");
    }
  }, [modalData]);

  /**
   * 폼 제출 처리 함수
   *
   * 워크스페이스 수정 데이터를 서버로 전송하고 모달을 닫습니다.
   */
  const handleSubmit = () => {
    if (!modalData?.id || !name.trim()) {
      toast.error("워크스페이스 이름을 입력해주세요.");
      return;
    }

    const payload: UpdateWorkspacePayload = {
      id: modalData.id,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    updateWorkspace.mutate(payload, {
      onSuccess: () => {
        toast.success("워크스페이스 수정이 완료되었습니다.");
        closeModal();
        // 폼 상태 초기화
        setName("");
        setDescription("");
      },
      onError: (error) => {
        toast.error("워크스페이스 수정에 실패했습니다.");
        console.error("Workspace update error:", error);
      },
    });
  };

  /**
   * 모달 닫기 처리 함수
   */
  const handleCancel = () => {
    closeModal();
    // 폼 상태 초기화
    setName("");
    setDescription("");
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="워크스페이스 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleCancel}
      okText="수정 완료"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: updateWorkspace.isPending,
        loading: updateWorkspace.isPending,
      }}
    >
      <form>
        {/* 워크스페이스 이름 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkspaceName">워크스페이스 이름</FormLabel>
          <Input
            type="text"
            id="updateWorkspaceName"
            placeholder="워크스페이스 이름을 입력해 주세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
            width="100%"
          />
        </FormItem>

        {/* 워크스페이스 설명 입력 필드 */}
        <FormItem>
          <FormLabel htmlFor="updateWorkspaceDescription">
            워크스페이스 설명
          </FormLabel>
          <TextArea
            id="updateWorkspaceDescription"
            placeholder="Infra Core 모델에서 활용할 WorkSpace입니다. yolov5, yolov8 Detect model을 활용한 연구를 진행합니다. AI Model 학습을 위한 워크스페이스입니다."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </FormItem>
      </form>
    </Modal>
  );
}

export default UpdateWorkspaceModal;
