"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { LoginBackgroundIcon } from "@/shared/components/icon/login-background";
import { LEGAL_INFO } from "@/shared/constants/legal.constant";
import { customScrollbar } from "@/styles/mixins/scrollbar";

/**
 * 사용자 인증 관련 페이지 공통 레이아웃
 * - signup, reset-password 등에서 공유
 */
export default function UserAuthLayout({ children }: PropsWithChildren) {
  return (
    <Container>
      <ContainerInner>
        <Left>
          <LeftBody>{children}</LeftBody>
          <LeftFooter>
            <FooterLinks>
              {LEGAL_INFO.FOOTER_LINKS.map((link, index) => (
                <span key={link.label}>
                  <StyledLink href={link.href}>
                    <Typography.Text variant="body-4-2" color="#828588">
                      {link.label}
                    </Typography.Text>
                  </StyledLink>
                  {index < LEGAL_INFO.FOOTER_LINKS.length - 1 && (
                    <Typography.Text variant="body-4-2" color="#828588">
                      ｜
                    </Typography.Text>
                  )}
                </span>
              ))}
            </FooterLinks>
            <Typography.Text variant="body-4-2" color="#828588">
              {LEGAL_INFO.COMPANY_INFO}
            </Typography.Text>
          </LeftFooter>
        </Left>
        <Right>
          <LoginBackgroundIcon />
        </Right>
      </ContainerInner>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: #fff;

  ${customScrollbar()}
`;

const ContainerInner = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Left = styled.div`
  width: 620px;
  flex-shrink: 0;
  height: 100%;
  padding: 30px 90px;
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex: 1;
  min-width: 620px;
  height: 100%;
  position: relative;
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

const FooterLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  span {
    display: flex;
    align-items: center;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
