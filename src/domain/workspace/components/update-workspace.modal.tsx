"use client";

import { useState } from "react";
import { Icon, Input, Modal, TextArea } from "xiilab-ui";

import { FormLabel } from "@/shared/components/form/form-label";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { openUpdateWorkspaceModalAtom } from "@/shared/state/modal.atom";
import { FormItem } from "@/styles/layers/form-layer.styled";
import { useUpdateWorkspace } from "../hooks/use-update-workspace";
import type { WorkspaceDetailType } from "../schemas/workspace.schema";
import type { UpdateWorkspacePayload } from "../types/workspace.type";

/**
 * 워크스페이스 수정 모달 컴포넌트
 *
 * 워크스페이스의 이름과 설명을 수정할 수 있는 모달입니다.
 * 설정 페이지에서 사용되는 모달입니다.
 */
export function UpdateWorkspaceModal() {
  // 모달 상태 관리
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateWorkspaceModalAtom,
  );

  // 폼 상태
  const [workspaceId, setWorkspaceId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const updateWorkspace = useUpdateWorkspace();

  /**
   * 폼 제출 처리 함수
   *
   * 워크스페이스 수정 데이터를 서버로 전송하고 모달을 닫습니다.
   */
  const handleSubmit = () => {
    const payload = createPayload();
    if (payload) {
      updateWorkspace.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const createPayload = (): UpdateWorkspacePayload => {
    return {
      id: workspaceId,
      name: name,
      description: description,
    };
  };

  useSubscribe(
    WORKSPACE_EVENTS.sendUpdateWorkspace,
    (eventData: WorkspaceDetailType) => {
      setWorkspaceId(eventData.id);
      setName(eventData.name);
      setDescription(eventData.description || "");
      onOpen();
    },
  );

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
      onCancel={onClose}
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
