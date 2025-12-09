"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

interface RevokeWarningTooltipTitleProps {
  count: number;
}

export function RevokeWarningTooltipTitle({
  count = 0,
}: RevokeWarningTooltipTitleProps) {
  return (
    <Container>
      <Header>
        <Typography.Text variant="body-2-2" color="#000">
          리소스 회수 경고
        </Typography.Text>
      </Header>
      <Body>
        <Typography.Text variant="body-2-4" color="#000">
          경고 횟수
        </Typography.Text>
        <Typography.Text variant="body-2-4" color="#000">
          {count.toLocaleString()}개
        </Typography.Text>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Header = styled.div`
  padding-bottom: 6px;
  border-bottom: 1px solid #E9EBEE;
  text-align: center;
`;

const Body = styled.div`
  padding-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
`;
