"use client";

import { useState } from "react";
import { Icon, Modal } from "xiilab-ui";

import { openApproveResourceModalAtom } from "@/atoms/workspace/workspace-request-resource.atom";
import { UpdateResourceProgress } from "@/components/common/progress/update-resource-progress";
import { WORKSPACE_EVENTS } from "@/constants/common/pubsub.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSubscribe } from "@/hooks/common/use-pub-sub";
import type { WorkspaceRequestResourceListType } from "@/schemas/workspace-request-resource.schema";
import {
  UpdateResourceModalContainer,
  UpdateResourceModalIconDescription,
  UpdateResourceModalIconWrapper,
  UpdateResourceModalResource,
  UpdateResourceModalResourceHeader,
  UpdateResourceModalResourceTitle,
  UpdateResourceModalWorkspace,
  UpdateResourceModalWorkspaceLeft,
  UpdateResourceModalWorkspaceName,
  UpdateResourceModalWorkspaceRight,
} from "@/styles/layers/update-resource-modal-layers.styled";

export function ApproveResourceModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openApproveResourceModalAtom,
  );

  const [workspaceName, setWorkspaceName] = useState<string>(
    "Workspace_AstraGo02",
  );

  const [gpuReq, setGpuReq] = useState<number>(1);
  const [cpuReq, setCpuReq] = useState<number>(1);
  const [memReq, setMemReq] = useState<number>(1);

  const handleSubmit = () => {};

  useSubscribe<WorkspaceRequestResourceListType>(
    WORKSPACE_EVENTS.sendApproveResource,
    (eventData) => {
      setWorkspaceName(eventData.workspaceName);
      setGpuReq(eventData.gpuReq);
      setCpuReq(eventData.cpuReq);
      setMemReq(eventData.memReq);
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit02" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="리소스 승인"
      showCancelButton
      cancelText="취소"
      onCancel={onClose}
      okText="리소스 승인"
      onOk={handleSubmit}
      centered
      showHeaderBorder
      okButtonProps={
        {
          // disabled: updateWorkspaceMember.isPending, // MIG 업데이트 중일 때 확인 버튼 비활성화
        }
      }
    >
      <UpdateResourceModalContainer>
        <UpdateResourceModalWorkspace>
          <UpdateResourceModalWorkspaceLeft>
            <UpdateResourceModalIconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={16} />
            </UpdateResourceModalIconWrapper>
            <UpdateResourceModalIconDescription>
              워크스페이스
            </UpdateResourceModalIconDescription>
          </UpdateResourceModalWorkspaceLeft>
          <UpdateResourceModalWorkspaceRight>
            <UpdateResourceModalWorkspaceName>
              {workspaceName}
            </UpdateResourceModalWorkspaceName>
          </UpdateResourceModalWorkspaceRight>
        </UpdateResourceModalWorkspace>
        <UpdateResourceModalResource>
          <UpdateResourceModalResourceHeader>
            <UpdateResourceModalResourceTitle>
              GPU
            </UpdateResourceModalResourceTitle>
          </UpdateResourceModalResourceHeader>
          <UpdateResourceProgress
            min={0}
            max={200}
            value={gpuReq}
            setValue={setGpuReq}
            resourceColor="#A353FF"
          />
        </UpdateResourceModalResource>
        <UpdateResourceModalResource>
          <UpdateResourceModalResourceHeader>
            <UpdateResourceModalResourceTitle>
              CPU
            </UpdateResourceModalResourceTitle>
          </UpdateResourceModalResourceHeader>
          <UpdateResourceProgress
            min={0}
            max={200}
            value={cpuReq}
            setValue={setCpuReq}
            resourceColor="#376DFF"
          />
        </UpdateResourceModalResource>
        <UpdateResourceModalResource>
          <UpdateResourceModalResourceHeader>
            <UpdateResourceModalResourceTitle>
              MEM
            </UpdateResourceModalResourceTitle>
          </UpdateResourceModalResourceHeader>
          <UpdateResourceProgress
            min={0}
            max={200}
            value={memReq}
            setValue={setMemReq}
            resourceColor="#A353FF"
          />
        </UpdateResourceModalResource>
      </UpdateResourceModalContainer>
    </Modal>
  );
}

