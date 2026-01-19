"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, Icon, Modal } from "xiilab-ui";

import type { WorkspaceCreateRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetDefaultResource } from "@/api/generated/workspace/workspace";
import {
  WorkspaceInfoSection,
  WorkspaceResourceSection,
} from "@/domain/workspace/components/workspace-form-sections";
import { useCreateWorkspaceAction } from "@/domain/workspace/hooks/workspace-actions";
import {
  type CreateWorkspaceFormType,
  createWorkspaceBodyExtended,
} from "@/domain/workspace/utils/create-workspace-form.override.zod";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateWorkspaceModalAtom } from "@/shared/state/modal.atom";

export function CreateWorkspaceModal() {
  const { open, onClose } = useGlobalModal(openCreateWorkspaceModalAtom);

  const {
    data: defaultResourceData,
    isLoading: isLoadingResources,
    isFetching: isFetchingResources,
    isError: isErrorResources,
  } = useGetDefaultResource({
    query: {
      enabled: open,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateWorkspaceFormType>({
    resolver: zodResolver(createWorkspaceBodyExtended),
    defaultValues: {
      workspaceName: "",
      description: "",
      resource: undefined,
    },
  });

  const resource =
    open && !isFetchingResources && !isErrorResources
      ? defaultResourceData?.resource
      : undefined;

  useEffect(() => {
    if (!resource) return;
    setValue("resource", resource);
  }, [resource, setValue]);

  const createWorkspaceMutation = useCreateWorkspaceAction();
  const isPending = createWorkspaceMutation.isPending;

  const handleClose = () => {
    if (isPending) return;
    onClose();
    reset();
  };

  const onSubmit = (formData: CreateWorkspaceFormType) => {
    if (!resource) {
      return;
    }

    const payload: WorkspaceCreateRequest = {
      workspaceName: formData.workspaceName,
      ...(formData.description ? { description: formData.description } : {}),
      resource,
    };

    createWorkspaceMutation.mutate(
      { data: payload },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="Plus" color="#fff" size={20} />}
      modalWidth={370}
      open={open}
      closable={!isPending}
      title="워크스페이스 생성"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="생성"
      onOk={handleSubmit(onSubmit)}
      centered
      showHeaderBorder
      maskClosable={!isPending}
      keyboard={!isPending}
      cancelButtonProps={{ disabled: isPending }}
      okButtonProps={{
        loading: isPending,

        disabled:
          isPending || isLoadingResources || isFetchingResources || !resource,
      }}
    >
      <Form layout="vertical">
        <WorkspaceResourceSection resource={resource} />
        <WorkspaceInfoSection
          control={control}
          errors={errors}
          isPending={isPending}
        />
      </Form>
    </Modal>
  );
}
