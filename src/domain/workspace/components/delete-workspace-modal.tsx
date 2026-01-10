"use client";

import { useRef, useState } from "react";
import styled from "styled-components";
import { FormItem, Input, Modal } from "xiilab-ui";

import { useDeleteWorkspaceAction } from "@/domain/workspace/hooks/workspace-actions";
import { openDeleteWorkspaceModalAtom } from "@/domain/workspace/state/workspace.atom";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

export function DeleteWorkspaceModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openDeleteWorkspaceModalAtom,
  );

  const workspaceIdRef = useRef<number | null>(null);
  const workspaceNameRef = useRef<string>("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const deleteWorkspaceMutation = useDeleteWorkspaceAction();
  const isPending = deleteWorkspaceMutation.isPending;

  const handleClose = () => {
    if (isPending) return;
    onClose();
    workspaceIdRef.current = null;
    workspaceNameRef.current = "";
    setWorkspaceName("");
    setInputValue("");
    setErrorMessage("");
  };

  const handleOk = () => {
    if (isPending) return;
    if (workspaceIdRef.current === null) return;

    // 워크스페이스 이름이 일치하지 않으면 에러 메시지 표시
    if (inputValue !== workspaceNameRef.current) {
      setErrorMessage(
        "워크스페이스를 잘못 입력하셨습니다. 다시 입력해 주세요.",
      );
      return;
    }

    deleteWorkspaceMutation.mutate(
      { workspaceId: workspaceIdRef.current },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useSubscribe(
    WORKSPACE_EVENTS.sendDeleteWorkspace,
    (data: { workspaceId: number; workspaceName: string }) => {
      workspaceIdRef.current = data.workspaceId;
      workspaceNameRef.current = data.workspaceName;
      setWorkspaceName(data.workspaceName);
      setInputValue("");
      setErrorMessage("");
      onOpen();
    },
  );

  return (
    <Modal
      variant="delete"
      modalWidth={310}
      open={open}
      closable={!isPending}
      onCancel={handleClose}
      onOk={handleOk}
      title="워크스페이스 삭제"
      centered
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled: isPending,
        loading: isPending,
      }}
    >
      <ContentContainer>
        <DescriptionWrapper>
          <Description>
            한번 삭제한 워크스페이스는 복구 할 수 없습니다.
            <br />
            삭제하시려면 워크스페이스 이름을 입력해 주세요.
          </Description>
        </DescriptionWrapper>
        <WorkspaceNameDisplay>
          내 워크스페이스 : {workspaceName}
        </WorkspaceNameDisplay>
        <StyledFormItem
          validateStatus={errorMessage !== "" ? "error" : undefined}
          help={errorMessage || undefined}
        >
          <Input
            placeholder="워크스페이스의 이름을 입력해 주세요."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setErrorMessage("");
            }}
            disabled={isPending}
          />
        </StyledFormItem>
      </ContentContainer>
    </Modal>
  );
}

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const DescriptionWrapper = styled.div`
  margin-bottom: 16px;
`;

const Description = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
`;

const StyledFormItem = styled(FormItem)`
  margin-top: 4px;
  margin-bottom: 0;
`;

const WorkspaceNameDisplay = styled.div`
  position: relative;
  font-size: 11px;
  color: #333;
  padding-left: 12px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #454f62;
  }
`;
