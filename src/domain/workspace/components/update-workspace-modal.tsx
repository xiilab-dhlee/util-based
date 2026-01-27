"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import { Form, FormItem, Icon, Input, Modal, TextArea } from "xiilab-ui";
import type { z } from "zod";

import { useGetWorkspaceDetail } from "@/api/generated/workspace/workspace";
import { WORKSPACE_DESCRIPTION_MAX_LENGTH } from "@/domain/workspace/constants/workspace-validation.constant";
import { useUpdateWorkspaceAction } from "@/domain/workspace/hooks/workspace-actions";
import { openUpdateWorkspaceModalAtom } from "@/domain/workspace/state/workspace.atom";
import { updateWorkspaceBodyExtended } from "@/domain/workspace/utils/update-workspace-form.override.zod";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

type UpdateWorkspaceFormType = z.infer<typeof updateWorkspaceBodyExtended>;

type UpdateWorkspaceEventData = { id: number };

export function UpdateWorkspaceModal() {
  const { open, onOpen, onClose } = useGlobalModal(
    openUpdateWorkspaceModalAtom,
  );

  const [workspaceId, setWorkspaceId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateWorkspaceFormType>({
    resolver: zodResolver(updateWorkspaceBodyExtended),
    defaultValues: {
      workspaceName: "",
      description: "",
    },
  });

  const {
    data: workspaceDetail,
    isFetching: isWorkspaceDetailFetching,
    isError: isWorkspaceDetailError,
  } = useGetWorkspaceDetail(workspaceId ?? 0, {
    query: { enabled: Boolean(workspaceId) },
  });

  const updateWorkspaceMutation = useUpdateWorkspaceAction();
  const isPending = updateWorkspaceMutation.isPending;

  const handleClose = () => {
    if (isPending) return;
    onClose();
    reset();
    setWorkspaceId(null);
  };

  const onSubmit = (formData: UpdateWorkspaceFormType) => {
    if (workspaceId === null) return;

    updateWorkspaceMutation.mutate(
      {
        workspaceId,
        data: {
          workspaceName: formData.workspaceName,
          description: formData.description,
        },
      },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  useEffect(() => {
    if (!open) return;
    if (workspaceId === null) return;
    if (!workspaceDetail) return;
    if (isDirty) return;

    reset({
      workspaceName: workspaceDetail.workspaceName,
      description: workspaceDetail.description || "",
    });
  }, [isDirty, open, reset, workspaceDetail, workspaceId]);

  useSubscribe(
    WORKSPACE_EVENTS.sendUpdateWorkspace,
    (eventData: UpdateWorkspaceEventData) => {
      setWorkspaceId(eventData.id);
      reset({ workspaceName: "", description: "" });
      onOpen();
    },
  );

  return (
    <Modal
      type="primary"
      icon={<Icon name="Edit01" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="워크스페이스 수정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="수정 완료"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        disabled:
          isPending || isWorkspaceDetailFetching || isWorkspaceDetailError,
        loading: isPending || isWorkspaceDetailFetching,
      }}
    >
      <StyledForm layout="vertical">
        <Controller
          name="workspaceName"
          control={control}
          render={({ field }) => (
            <FormItem
              label="워크스페이스 이름"
              htmlFor="update-workspace-name"
              required
              validateStatus={errors.workspaceName ? "error" : undefined}
              help={errors.workspaceName?.message}
            >
              <Input
                {...field}
                value={field.value ?? ""}
                id="update-workspace-name"
                type="text"
                placeholder="워크스페이스 이름을 입력해 주세요."
                maxLength={50}
                width="100%"
                disabled={
                  isPending ||
                  isWorkspaceDetailFetching ||
                  isWorkspaceDetailError
                }
              />
            </FormItem>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <LastFormItem
              label="워크스페이스 설명"
              htmlFor="update-workspace-description"
              validateStatus={errors.description ? "error" : undefined}
              help={errors.description?.message}
            >
              <TextArea
                {...field}
                value={field.value ?? ""}
                id="update-workspace-description"
                placeholder="워크스페이스 설명을 입력해 주세요."
                maxLength={WORKSPACE_DESCRIPTION_MAX_LENGTH}
                disabled={
                  isPending ||
                  isWorkspaceDetailFetching ||
                  isWorkspaceDetailError
                }
                resize="none"
                height="110px"
              />
            </LastFormItem>
          )}
        />
      </StyledForm>
    </Modal>
  );
}

const StyledForm = styled(Form)`
  width: 100%;
`;

const LastFormItem = styled(FormItem)`
  && {
    margin-bottom: 0;
  }
`;
