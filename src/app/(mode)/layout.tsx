"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { CreateFirstWorkspaceModal } from "@/domain/workspace/components/create-first-workspace-modal";
import { Navigation } from "@/shared/components/layouts/navigation";
import { CheckPasswordModal } from "@/shared/components/modal/check-password-modal";
import { CreateWorkspaceModal } from "@/shared/components/modal/create-workspace-modal";
import { UpdatePasswordModal } from "@/shared/components/modal/update-password-modal";
import { customScrollbar } from "@/styles/mixins/scrollbar";

export default function ModeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Container>
        <Left>
          <Navigation />
        </Left>
        <Right>
          <RightInner>
            <Main>{children}</Main>
          </RightInner>
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
  justify-content: flex-start;
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
  padding-bottom: var(--page-margin-bottom);
  overflow-y: auto;
  overflow-x: auto;

  ${customScrollbar()}
`;

const RightInner = styled.div`
  min-width: calc(1920px - var(--navigation-width) - var(--page-inner-padding) * 2);
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  position: relative;
  /* margin-bottom: var(--page-margin-bottom); */
`;
