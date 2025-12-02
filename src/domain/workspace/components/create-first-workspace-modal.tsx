"use client";

import { type FormEvent, useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  BaseModal,
  Button,
  Icon,
  Input,
  TextArea,
  Typography,
} from "xiilab-ui";

import { useCreateWorkspace } from "@/domain/workspace/hooks/use-create-workspace";
import type { CreateWorkspacePayload } from "@/domain/workspace/types/workspace.type";
import { FormLabel } from "@/shared/components/form/form-label";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openCreateFirstWorkspaceModalAtom } from "@/shared/state/modal.atom";
import { FormItem } from "@/styles/layers/form-layer.styled";

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
  const formRef = useRef<HTMLFormElement>(null);
  // 모달 상태 관리
  const { open, onClose } = useGlobalModal(openCreateFirstWorkspaceModalAtom);

  const createWorkspace = useCreateWorkspace();

  /**
   * 폼 제출 처리 함수
   *
   * 워크스페이스 수정 데이터를 서버로 전송하고 모달을 닫습니다.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const payload = createPayload();
    if (payload) {
      if (payload.name === "") {
        toast.error("워크스페이스 이름을 입력해 주세요.");
        return;
      }
      if (payload.description === "") {
        toast.error("워크스페이스 설명을 입력해 주세요.");
        return;
      }
      createWorkspace.mutate(payload, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const createPayload = (): CreateWorkspacePayload | null => {
    if (!formRef.current) return null;
    // 폼 데이터 수집
    const formData = new FormData(formRef.current);

    return {
      name: formData.get("firstWorkspaceName") as string,
      description: formData.get("firstWorkspaceDescription") as string,
    };
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
              관리자 또는 기존 워크스페이스 생성자에게 문의해 주세요.
            </Typography.Text>
          </Description>
          <Resource>
            <Typography.Text variant="subtitle-2-2" color="#000">
              리소스
            </Typography.Text>
            <ResourceBody>
              <ResourceRow>
                <ResourceItem>
                  <Typography.Text variant="body-2-3" color="#000">
                    GPU
                  </Typography.Text>
                  <ResourceValue>
                    <Typography.Text variant="body-2-3" color="#000">
                      {DEMO_LIMIT_WORKSPACE.gpuCount || 0}개
                    </Typography.Text>
                  </ResourceValue>
                </ResourceItem>
                <ResourceItem>
                  <Typography.Text variant="body-2-3" color="#000">
                    CPU
                  </Typography.Text>
                  <ResourceValue>
                    <Typography.Text variant="body-2-3" color="#000">
                      {DEMO_LIMIT_WORKSPACE.cpuCore || 0}Core
                    </Typography.Text>
                  </ResourceValue>
                </ResourceItem>
              </ResourceRow>
              <ResourceRow>
                <ResourceItem>
                  <Typography.Text variant="body-2-3" color="#000">
                    Memory
                  </Typography.Text>
                  <ResourceValue>
                    <Typography.Text variant="body-2-3" color="#000">
                      {DEMO_LIMIT_WORKSPACE.memoryGb || 0}GB
                    </Typography.Text>
                  </ResourceValue>
                </ResourceItem>
                <ResourceItem>
                  <Typography.Text variant="body-2-3" color="#000">
                    MPS
                  </Typography.Text>
                  <ResourceValue>
                    <Typography.Text variant="body-2-3" color="#000">
                      {DEMO_LIMIT_WORKSPACE.mpsReplica || 0}개
                    </Typography.Text>
                  </ResourceValue>
                </ResourceItem>
              </ResourceRow>
              <MigContainer>
                <MigHeader>
                  <Typography.Text variant="body-2-3" color="#000">
                    MIG
                  </Typography.Text>
                  <Typography.Text variant="body-3-3" color="#676767">
                    전체{" "}
                    {DEMO_LIMIT_WORKSPACE.MigProfile.reduce(
                      (acc, curr) =>
                        acc + curr.reduce((acc, curr) => acc + curr.count, 0),
                      0,
                    )}
                    개
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
            </ResourceBody>
          </Resource>
          <form ref={formRef}>
            <FormItem>
              <FormLabel htmlFor="firstWorkspaceName">이름</FormLabel>
              <Input
                type="text"
                id="firstWorkspaceName"
                name="firstWorkspaceName"
                placeholder="워크스페이스 이름을 입력해 주세요."
                width="100%"
              />
            </FormItem>
            <FormItem>
              <FormLabel htmlFor="firstWorkspaceDescription">설명</FormLabel>
              <TextArea
                id="firstWorkspaceDescription"
                name="firstWorkspaceDescription"
                placeholder="설명을 입력해 주세요."
                height={110}
              />
            </FormItem>
            <SubmitButton
              type="submit"
              color="primary"
              variant="gradient"
              width="100%"
              height={34}
              onClick={handleSubmit}
              loading={createWorkspace.isPending}
            >
              생성
            </SubmitButton>
          </form>
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

const Resource = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;
  margin-bottom: 20px;
`;

const ResourceBody = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #E1E4E7;
  border-radius: 2px;
`;

const ResourceRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 6px 0;
  border-bottom: 1px solid #D7DCE0;
`;

const ResourceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 24px;
  flex: 1;

  & + & {
    border-left: 1px solid #D7DCE0;
  }
`;

const ResourceValue = styled.div`
  flex: 1;
  text-align: right;
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
`;

const MigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const MigBody = styled.div`
  border-top: 1px solid #D7DCE0;
  display: flex;
  flex-direction: column;
  padding: 0 4px;
`;

const MigProfileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px 0;

  & + & {
    border-top: 1px solid #D7DCE0;
  }
`;

const MigProfileItem = styled.div`
  grid-column: span 1;
  text-align: center;

  & + & {
    border-left: 1px solid #D7DCE0;
  }
`;
