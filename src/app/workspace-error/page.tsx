"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { CheckPasswordModal } from "@/domain/profile/components/check-password-modal";
import { UpdateProfileModal } from "@/domain/profile/components/update-profile-modal";
import { CreateFirstWorkspaceModal } from "@/domain/workspace/components/create-first-workspace-modal";
import { CreateWorkspaceModal } from "@/domain/workspace/components/create-workspace-modal";
import { Navigation } from "@/shared/components/layouts/navigation";

export default function WorkspaceError() {
  return (
    <>
      <Container>
        <Left>
          <Navigation />
        </Left>
        <Right>
          <RightBody>
            <Title>503</Title>
            <WorkspaceErrorHeadline variant="headline-3-1" color="#292B32">
              워크스페이스를 불러올 수 없습니다
            </WorkspaceErrorHeadline>
            <WorkspaceErrorDescription variant="subtitle-2-3" color="#5F6368">
              워크스페이스 목록을 불러오는데 실패했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </WorkspaceErrorDescription>
          </RightBody>
        </Right>
      </Container>
      <CreateFirstWorkspaceModal />
      <CreateWorkspaceModal />
      <CheckPasswordModal />
      <UpdateProfileModal />
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Left = styled.div`
  width: var(--navigation-width);
  height: 100%;
`;

const Right = styled.div`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 var(--page-inner-padding);
  overflow: hidden;
  background-color: #f3f3f3;
`;

const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  text-align: center;
`;

const WorkspaceErrorHeadline = styled(Typography.Title)`
  margin-bottom: 14px;
`;

const WorkspaceErrorDescription = styled(Typography.Text)`
  margin-bottom: 40px;
`;

const Title = styled.div`
  color: #534ad8;
  line-height: 140px;
  font-size: 150px;
  font-weight: 250;
  margin-bottom: 20px;
`;
