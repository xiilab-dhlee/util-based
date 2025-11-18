"use client";

import styled from "styled-components";

interface ModalDetailCardProps {
  records: { label: string; value?: string; labelLevel?: 1 | 2 }[];
}

export function ModalDetailCard({ records }: ModalDetailCardProps) {
  return (
    <Container>
      {records.map(({ label, value, labelLevel }) => (
        <Record key={label}>
          {labelLevel === 1 ? <Title>{label}</Title> : <Key>{label}</Key>}
          {labelLevel !== 1 ? <Value>{value || "-"}</Value> : null}
        </Record>
      ))}
    </Container>
  );
}

const Container = styled.div`
  border-radius: 2px;
  border: 1px solid #e9e9e9;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  width: 100%;
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;

const Key = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  width: 60px;
  text-align: left;
  color: #484848;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;
