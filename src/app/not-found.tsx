"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, Typography } from "xiilab-ui";

import { CreateFirstWorkspaceModal } from "@/domain/workspace/components/create-first-workspace-modal";
import { Navigation } from "@/shared/components/layouts/navigation";
import { CheckPasswordModal } from "@/shared/components/modal/check-password-modal";
import { CreateWorkspaceModal } from "@/shared/components/modal/create-workspace-modal";
import { UpdatePasswordModal } from "@/shared/components/modal/update-password-modal";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };
  return (
    <>
      <Container>
        <Left>
          <Navigation />
        </Left>
        <Right>
          <RightBody>
            <Title>404</Title>
            <Typography.Title
              variant="headline-3-1"
              color="#292B32"
              style={{ marginBottom: 14 }}
            >
              앗! 페이지를 찾을 수 없어요 :(
            </Typography.Title>
            <Typography.Text
              variant="subtitle-2-3"
              color="#5F6368"
              style={{ marginBottom: 40 }}
            >
              죄송합니다. 요청하신 페이지가 존재하지 않습니다.
              <br />
              메인에서 원하시는 정보를 찾아보세요.
            </Typography.Text>
            <Button
              color="primary"
              iconPosition="left"
              variant="gradient"
              width={340}
              onClick={handleBack}
            >
              메인으로 돌아가기
            </Button>
          </RightBody>
        </Right>
      </Container>
      {/* 워크스페이스 생성 모달 */}
      <CreateFirstWorkspaceModal />
      <CreateWorkspaceModal />
      {/* 비밀번호 재확인 모달 */}
      <CheckPasswordModal />
      {/* 비밀번호 수정 모달 */}
      <UpdatePasswordModal />
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
  background-color: #F3F3F3;
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

const Title = styled.div`
  color: #534AD8;
  line-height: 140px;
  font-size: 150px;
  font-weight: 250;
  margin-bottom: 20px;
`;
