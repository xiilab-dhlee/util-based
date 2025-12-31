"use client";

import Link from "next/link";
import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { LoginBackgroundIcon } from "@/shared/components/icon/login-background";
import { LEGAL_INFO } from "@/shared/constants/legal.constant";

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
  overflow: hidden;
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

const Right = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
  min-width: 1300px;
`;
