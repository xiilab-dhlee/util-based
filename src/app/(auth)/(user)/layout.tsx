"use client";

import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { LoginBackgroundIcon } from "@/shared/components/icon/login-background";

/**
 * 사용자 인증 관련 페이지 공통 레이아웃
 * - signup, reset-password 등에서 공유
 */
export default function UserAuthLayout({ children }: PropsWithChildren) {
  return (
    <Container>
      <Left>
        <LeftBody>{children}</LeftBody>
        <LeftFooter>
          <Typography.Text variant="body-4-2" color="#828588">
            도움말｜개인정보처리방침｜이용약관
          </Typography.Text>
          <Typography.Text variant="body-4-2" color="#828588">
            (주)씨이랩｜대표이사 : 채정환, 윤세혁｜사업자등록번호 : 119-86-31534
          </Typography.Text>
        </LeftFooter>
      </Left>
      <Right>
        <LoginBackgroundIcon />
      </Right>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
`;

const Left = styled.div`
  flex-basis: 620px;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
`;

const LeftBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const LeftFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Right = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 1300px;
`;
