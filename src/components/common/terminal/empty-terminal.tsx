"use client";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

export function EmptyTerminal() {
  return (
    <Container>
      <IconWrapper>
        <Icon name="Terminal" size={48} color="var(--gray04)" />
      </IconWrapper>
      <Title>터미널을 시작하려면 연결 정보를 설정하세요</Title>
      <Description>
        워크로드, 서버, 컨테이너 등에 연결하여 터미널을 사용할 수 있습니다.
      </Description>
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  width: 100%;
  text-align: center;
  background-color: var(--gray01);
  border-radius: 8px;
`;

const IconWrapper = styled.div`
  margin-bottom: 1rem;
  opacity: 0.6;
`;

const Title = styled.h3`
  font-size: var(--fs-3);
  font-weight: 600;
  color: var(--gray06);
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  font-size: var(--fs-2);
  color: var(--gray05);
  margin: 0;
  line-height: 1.5;
`;
