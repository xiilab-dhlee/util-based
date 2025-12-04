"use client";

import styled from "styled-components";

/**
 * 슬라이더 범례 컴포넌트
 * 기존 할당량, 요청량 마크 설명을 표시합니다.
 */
export function SliderLegend() {
  return (
    <LegendContainer>
      <LegendItem>
        <LegendDot />
        <LegendLabel>기존 할당량</LegendLabel>
      </LegendItem>
      <LegendItem>
        <LegendDot $isRequest />
        <LegendLabel $isRequest>요청량</LegendLabel>
      </LegendItem>
    </LegendContainer>
  );
}

const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LegendDot = styled.span<{ $isRequest?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $isRequest }) => ($isRequest ? "#F2F7FF" : "white")};
  border: 1px solid ${({ $isRequest }) => ($isRequest ? "#BFD3FF" : "#E0E0E0")};
`;

const LegendLabel = styled.span<{ $isRequest?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: ${({ $isRequest }) => ($isRequest ? "#003BC5" : "#404040")};
`;
