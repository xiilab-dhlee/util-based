"use client";

import styled from "styled-components";

interface KubernetesResourceCardProps {
  resourceName: string;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function KubernetesResourceCard({
  resourceName,
  count,
  isActive = false,
  onClick,
}: KubernetesResourceCardProps) {
  return (
    <Container $active={isActive} onClick={onClick}>
      <Header>
        <Title>{resourceName}</Title>
      </Header>
      <Body>
        <Record>
          <Key>개수</Key>
          <Value>{count.toLocaleString()}</Value>
        </Record>
      </Body>
    </Container>
  );
}

const Container = styled.div<{ $active?: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? "var(--color-blue-05)" : "#d1d5dc")};
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  padding: 8px 10px;
  background-color: #fcfcfc;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 3px;
  border-bottom: 1px solid #d1d5dc73;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const Body = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 3px;
`;

const Record = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 4px;
`;

const Key = styled.div`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #000;
`;

const Value = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;
