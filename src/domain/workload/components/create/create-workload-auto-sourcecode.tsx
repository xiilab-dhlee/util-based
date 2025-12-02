"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

export function CreateWorkloadAutoSourcecode() {
  return (
    <Container>
      <Typography.Text variant="subtitle-2-1">소스코드</Typography.Text>
      <Body>
        <Message>
          <Typography.Text variant="body-2-4" color="#000000">
            허브 이미지 선택 시, 해당 이미지 내에 소스코드가 사전 패키징되어
            포함되어 있습니다.
          </Typography.Text>
        </Message>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Body = styled.div`
  padding: 16px;
  background: #fcfcfc;
  border: 1px solid #c1c7ce;
  border-radius: 4px;
`;

const Message = styled.div`
  padding: 0 48px 0 0;
`;
