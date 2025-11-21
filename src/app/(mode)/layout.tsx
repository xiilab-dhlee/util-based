"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { GlobalLoadingSpinner } from "@/shared/components/global-loading-spinner";
import { Navigation } from "@/shared/components/layouts/navigation";
import { CheckPasswordModal } from "@/shared/components/modal/check-password-modal";
import { CreateWorkspaceModal } from "@/shared/components/modal/create-workspace-modal";
import { UpdatePasswordModal } from "@/shared/components/modal/update-password-modal";

export default function ModeLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Container>
        <Navigation />
        <Page>
          <Main>{children}</Main>
        </Page>
      </Container>
      {/* 워크스페이스 생성 모달 */}
      <CreateWorkspaceModal />
      {/* 비밀번호 재확인 모달 */}
      <CheckPasswordModal />
      {/* 비밀번호 수정 모달 */}
      <UpdatePasswordModal />
      {/* 로딩 스피너 */}
      <GlobalLoadingSpinner />
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  overflow: hidden;
`;

const Page = styled.div`
  flex: 1;
  padding: 0 40px;
  overflow-y: auto;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-bottom: var(--page-margin-bottom);
`;
