"use client";

import { useRef } from "react";
import styled from "styled-components";
import { Input, Modal, TextArea } from "xiilab-ui";

import { openCreateWorkspaceModalAtom } from "@/atoms/common/modal.atom";
import { FormLabel } from "@/components/common/form/form-label";
import { MyIcon } from "@/components/common/icon";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useCreateWorkspace } from "@/hooks/workspace/use-create-workspace";
import { FormItem } from "@/styles/layers/form-layer.styled";
import type { CreateWorkspacePayload } from "@/types/workspace/workspace.interface";

/**
 * 크레덴셜 생성 모달 컴포넌트
 *
 * 새로운 크레덴셜을 생성할 수 있는 모달입니다.
 */
export function CreateWorkspaceModal() {
  const formRef = useRef<HTMLFormElement>(null);

  // useGlobalModal 훅을 사용하여 모달 상태 관리
  const { open, onClose } = useGlobalModal(openCreateWorkspaceModalAtom);

  const createWorkspace = useCreateWorkspace();

  const handleSubmit = () => {
    const payload = createPayload();

    // TODO: payload 검증 및 유효성 검사 추가 필요
    if (payload) {
      // TODO: validation 추가 필요
      createWorkspace.mutate(payload);
    }
  };

  const createPayload = (): CreateWorkspacePayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      name: formData.get("workspaceName") as string,
      description: formData.get("workspaceDescription") as string,
    };
  };

  return (
    <Modal
      type="primary"
      icon={<MyIcon name="Plus" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="워크스페이스 생성"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="생성"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={{
        disabled: false,
      }}
    >
      <form ref={formRef}>
        <FormItem>
          <FormLabel htmlFor="workspaceName">이름</FormLabel>
          <Input
            type="text"
            id="workspaceName"
            name="workspaceName"
            placeholder="워크스페이스 이름을 입력해 주세요."
            width="100%"
          />
        </FormItem>
        <FormItem>
          <FormLabel htmlFor="workspaceDescription">설명</FormLabel>
          <TextArea
            id="workspaceDescription"
            name="workspaceDescription"
            placeholder="설명을 입력해 주세요."
          />
        </FormItem>
        <FormItem>
          <FormLabel>리소스</FormLabel>
          <Resources>
            <ResourceItem>
              <span>GPU</span>
              <span>2개</span>
            </ResourceItem>
            <ResourceItem>
              <span>CPU</span>
              <span>8Core</span>
            </ResourceItem>
            <ResourceItem>
              <span>MEM</span>
              <span>16GB</span>
            </ResourceItem>
          </Resources>
        </FormItem>
      </form>
    </Modal>
  );
}

const Resources = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f3f5f7;
  height: 30px;
  border-radius: 2px;
`;

const ResourceItem = styled.li`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  text-align: center;

  & + & {
    border-left: 1px solid #d7dce0;
  }
`;
