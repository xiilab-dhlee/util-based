"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  BaseModal,
  Button,
  Form,
  FormItem,
  Icon,
  Input,
  TextArea,
  Typography,
} from "xiilab-ui";

import { useCreateWorkspace } from "@/domain/workspace/hooks/use-create-workspace";
import {
  type CreateWorkspaceType,
  createWorkspaceSchema,
} from "@/domain/workspace/schemas/workspace.schema";
import type { CreateWorkspacePayload } from "@/domain/workspace/types/workspace.type";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";

const DEMO_LIMIT_WORKSPACE = {
  gpuCount: 2,
  cpuCore: 8,
  memoryGb: 16,
  mpsReplica: 2,
  MigProfile: [
    [
      {
        name: "1g.12gb",
        count: 2,
      },
      {
        name: "2g.24gb",
        count: 2,
      },
      {
        name: "3g.36gb",
        count: 2,
      },
      {
        name: "4g.48gb",
        count: 2,
      },
    ],
    [
      {
        name: "7g.12gb",
        count: 2,
      },
    ],
  ],
};

export function CreateFirstWorkspaceModal() {
  const { open, onClose } = useGlobalModal(openCreateFirstWorkspaceModalAtom);

  const createWorkspace = useCreateWorkspace();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceType>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  /**
   * 폼 제출 처리 함수
   *
   */
  const onSubmit = (data: CreateWorkspaceType) => {
    const payload: CreateWorkspacePayload = {
      name: data.name,
      description: data.description,
    };

    createWorkspace.mutate(payload, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <BaseModal open={open} width={370} closable={false} maskClosable={false}>
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
          <Typography.Text variant="subtitle-2-2" color="#000">
            리소스
          </Typography.Text>
          <Resource>
            <ResourceItem>
              <Typography.Text variant="body-2-3" color="#000">
                GPU
              </Typography.Text>
              <Typography.Text variant="body-2-3" color="#676767">
                {DEMO_LIMIT_WORKSPACE.gpuCount}개
              </Typography.Text>
            </ResourceItem>
            <ResourceItem>
              <Typography.Text variant="body-2-3" color="#000">
                CPU
              </Typography.Text>
              <Typography.Text variant="body-2-3" color="#676767">
                {DEMO_LIMIT_WORKSPACE.cpuCore}Core
              </Typography.Text>
            </ResourceItem>
            <ResourceItem>
              <Typography.Text variant="body-2-3" color="#000">
                Memory
              </Typography.Text>
              <Typography.Text variant="body-2-3" color="#676767">
                {DEMO_LIMIT_WORKSPACE.memoryGb}GB
              </Typography.Text>
            </ResourceItem>
            <ResourceItem>
              <Typography.Text variant="body-2-3" color="#000">
                MPS
              </Typography.Text>
              <Typography.Text variant="body-2-3" color="#676767">
                {DEMO_LIMIT_WORKSPACE.mpsReplica}개
              </Typography.Text>
            </ResourceItem>
          </Resource>
          <MigContainer>
            <MigHeader>
              <Typography.Text variant="body-2-3" color="#000">
                MIG
              </Typography.Text>
              <Typography.Text variant="body-3-3" color="#5F6368">
                전체 8개
              </Typography.Text>
            </MigHeader>
            <MigBody>
              {DEMO_LIMIT_WORKSPACE.MigProfile.map((profile, index) => (
                <MigProfileRow key={`mig-profile-${index}`}>
                  {profile.map((item) => (
                    <MigProfileItem key={`${index}-${item.name}`}>
                      <Typography.Text variant="body-3-2" color="#000">
                        {item.name} {item.count}개
                      </Typography.Text>
                    </MigProfileItem>
                  ))}
                </MigProfileRow>
              ))}
            </MigBody>
          </MigContainer>
          <StyledForm onFinish={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="이름"
                  required
                  validateStatus={errors.name ? "error" : undefined}
                  htmlFor="create-workspace-name"
                  help={errors.name?.message}
                >
                  <Input
                    {...field}
                    type="text"
                    id="create-workspace-name"
                    placeholder="워크스페이스 이름을 입력해 주세요."
                    width="100%"
                    autoComplete="off"
                  />
                </FormItem>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <FormItem
                  label="설명"
                  required
                  validateStatus={errors.description ? "error" : undefined}
                  htmlFor="create-workspace-description"
                  help={errors.description?.message}
                >
                  <TextArea
                    {...field}
                    id="create-workspace-description"
                    placeholder="설명을 입력해 주세요."
                    width="100%"
                    height={110}
                  />
                </FormItem>
              )}
            />
            <SubmitButton
              type="submit"
              color="primary"
              variant="gradient"
              width="100%"
              height={34}
              loading={createWorkspace.isPending}
            >
              생성
            </SubmitButton>
          </StyledForm>
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
  margin-bottom: 20px;
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
  margin-top: 4px;
`;

const MigContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 6px;
  border: 1px solid #E1E4E7;
  border-radius: 2px;
  margin-top: 10px;
`;

const MigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #E1E4E7;
`;

const MigBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 4px;
`;

const MigProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 0;

  & + & {
    border-top: 1px solid #F3F3F3;
  }
`;

const MigProfileItem = styled.div`
  grid-column: span 1;
  text-align: center;

  & + & {
    border-left: 1px solid #F3F3F3;
  }
`;

const Resource = styled.div`
  display: flex;
  flex-direction: row;
  padding: 6px 0;
  border: 1px solid #E1E4E7;
  border-radius: 2px;
  margin-top: 5px;
`;

const ResourceItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;

  & + & {
    border-left: 1px solid #E1E4E7;
  }
`;

const StyledForm = styled(Form)`
  margin-top: 18px;
`;
