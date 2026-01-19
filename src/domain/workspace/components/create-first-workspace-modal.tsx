"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { BaseModal, Button, Form, Icon, Typography } from "xiilab-ui";

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
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";

export function CreateFirstWorkspaceModal() {
  const { open, onClose } = useGlobalModal(openCreateFirstWorkspaceModalAtom);

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
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <BaseModal
      open={open}
      width={370}
      closable={false}
      maskClosable={false}
      centered
    >
      <Container>
        <Header>
          <IconWrapper>
            <Icon name="Astrago" color="#fff" size={20} />
          </IconWrapper>
          <Typography.Text variant="title-1" color="#000">
            워크스페이스 생성
          </Typography.Text>
        </Header>
        <Body>
          <Description>
            <Typography.Text variant="body-2-4" color="#333333">
              AstraGo 2.0 이용을 위해 워크스페이스를 직접 생성하거나,
              <br />
              관리자 또는 기존 워크스페이스 생성자에게 권한을 문의해 주세요.
            </Typography.Text>
          </Description>

          <StyledForm layout="vertical">
            <WorkspaceResourceSection resource={resource} />
            <WorkspaceInfoSection
              control={control}
              errors={errors}
              isPending={isPending}
            />
          </StyledForm>

          <SubmitButton
            type="button"
            color="primary"
            variant="gradient"
            width="100%"
            height={34}
            loading={isPending}
            disabled={
              isPending ||
              isLoadingResources ||
              isFetchingResources ||
              !resource
            }
            onClick={handleSubmit(onSubmit)}
          >
            생성
          </SubmitButton>
        </Body>
      </Container>
    </BaseModal>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Description = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #5B29C7;
`;

const SubmitButton = styled(Button)`
  margin-top: 16px;
`;

const StyledForm = styled(Form)`
  margin-top: 20px;
`;
