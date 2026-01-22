"use client";

import styled from "styled-components";

import { UserPrivateRegistryMain } from "./user-private-registry-main";
import { UserPublicRegistryMain } from "./user-public-registry-main";

/**
 * 레지스트리 서브섹션 컴포넌트
 * 개인(private) 레지스트리와 공개(public) 레지스트리 사용자 목록을 나란히 표시합니다.
 */
export function RegistrySubSection() {
  return (
    <Container>
      <Pane>
        <UserPrivateRegistryMain />
      </Pane>
      <Pane>
        <UserPublicRegistryMain />
      </Pane>
    </Container>
  );
}

const Container = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 520px;
`;

const Pane = styled.article`
  height: 100%;
  padding: 24px 26px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;
