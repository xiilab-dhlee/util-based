"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { CheckPasswordModal } from "@/components/common/modal/check-password-modal";
import { CreateWorkspaceModal } from "@/components/common/modal/create-workspace-modal";
import { UpdatePasswordModal } from "@/components/common/modal/update-password-modal";
import { MySpinner } from "@/components/common/spinner";
import { MyNavigation } from "@/layouts/common/navigation";

export default function ModeLayout({ children }: PropsWithChildren) {
  const isMutating = useIsMutating();
  const isLoading = useIsFetching();

  return (
    <>
      <Container>
        <MyNavigation />
        <Page>
          <Main>
            {children}
            {isMutating > 0 && (
              <LoadingWrapper>
                <MySpinner />
              </LoadingWrapper>
            )}
            {isLoading > 0 && (
              <LoadingWrapper>
                <MySpinner />
              </LoadingWrapper>
            )}
          </Main>
        </Page>
      </Container>
      {/* 워크스페이스 생성 모달 */}
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

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);
`;
