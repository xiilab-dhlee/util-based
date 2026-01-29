"use client";

import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import type { AdminWorkspaceSingleDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { checkIsSuperAdmin } from "@/shared/utils/auth.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import { customScrollbar } from "@/styles/mixins/scrollbar";

interface WorkspaceIntroCardProps {
  workspace?: AdminWorkspaceSingleDetailResponse;
}

export function WorkspaceIntroCard({ workspace }: WorkspaceIntroCardProps) {
  const publish = usePublish();
  const { data: session } = useSession();
  const workspaceId = workspace?.workspaceId;

  const isSuperAdmin = checkIsSuperAdmin(session);

  const handleDelete = () => {
    if (!workspaceId) return;
    publish(WORKSPACE_EVENTS.sendDeleteAdminWorkspace, {
      workspaceId,
    });
  };

  const handleEdit = () => {
    if (!workspaceId) return;
    publish(WORKSPACE_EVENTS.sendUpdateWorkspace, {
      id: workspaceId,
    });
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>워크스페이스 기본정보</HeaderTitle>
        <ToolBox>
          {isSuperAdmin && (
            <IconWrapper onClick={handleEdit}>
              <Icon name="Edit01" color="var(--icon-fill)" size={24} />
              <span className="sr-only">워크스페이스 수정</span>
            </IconWrapper>
          )}
          <IconWrapper onClick={handleDelete}>
            <Icon name="Delete" color="var(--icon-fill)" size={24} />
            <span className="sr-only">워크스페이스 삭제</span>
          </IconWrapper>
        </ToolBox>
      </Header>
      <Body>
        <Row>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Workspace01" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>이름</RowTitle>
          </DescriptionRowBody>
          <Description>{workspace?.workspaceName || ""}</Description>
        </Row>
        <DescriptionRow>
          <DescriptionRowBody>
            <RowIconWrapper>
              <Icon name="Description" color="var(--icon-fill)" size={22} />
            </RowIconWrapper>
            <RowTitle>설명</RowTitle>
          </DescriptionRowBody>
          <Description>{workspace?.description ?? ""}</Description>
        </DescriptionRow>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="PersonFilled" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성자 :</RowKey>
              <RowValue>{workspace?.creatorName || ""}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
        <Row>
          <RowBody>
            <RowIconWrapper>
              <Icon name="Calendar01" color="var(--icon-fill)" size={24} />
            </RowIconWrapper>
            <RowTitle>
              <RowKey>생성일 :</RowKey>
              <RowValue>{formatDateSafely(workspace?.createdAt)}</RowValue>
            </RowTitle>
          </RowBody>
        </Row>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 490px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  background-color: #171b26;
  padding: 24px;
  overflow: hidden;
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  background: #070913;
  border: 1px solid #2a3041;
  padding: 8px 10px;
  border-radius: 4px;
  overflow: hidden;
`;

const DescriptionRow = styled(Row)`
  flex: 1;
`;

const RowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

const DescriptionRowBody = styled(RowBody)`
  margin-bottom: 6px;
`;

const RowTitle = styled.div`
  display: inline-block;
  height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const RowKey = styled.span`
  margin-right: 4px;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  color: #f5f5f5;
`;

const HeaderTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #f5f5f5;
  flex: 1;
  overflow: hidden;
`;

const ToolBox = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  background-color: transparent;

  --icon-fill: #ced5db;
`;

const RowIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 24px;
  height: 24px;
  border-radius: 2px;
  margin-right: 8px;

  --icon-fill: #e8eaed;
`;

const Description = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cbcbcb;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;

  ${customScrollbar("#2A3041")}
`;

const RowValue = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cacaca;
`;
