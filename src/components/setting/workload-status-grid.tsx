"use client";

import styled from "styled-components";

import WorkloadStatusCard from "./workload-status-card";

export interface WorkloadStatusData {
  /** 상태 타입 */
  type: "running" | "stopped" | "waiting" | "error";
  /** 건수 텍스트 */
  count: string;
  /** 하단 라벨 */
  label: string;
  /** 추가 데이터 (향후 확장용) */
  metadata?: Record<string, any>;
}

interface WorkloadStatusGridProps {
  /** 워크로드 상태 데이터 배열 */
  data: WorkloadStatusData[];
  /** 그리드 열 개수 (기본: 4) */
  columns?: number;
  /** 카드 크기 (기본: 136px) */
  cardSize?: number;
  /** 카드 간격 (기본: 12px) */
  gap?: number;
  /** 클릭 이벤트 핸들러 */
  onCardClick?: (data: WorkloadStatusData, index: number) => void;
}

/**
 * 워크로드 상태 카드들을 그리드로 표시하는 컨테이너 컴포넌트
 * 피그마 디자인과 일치하는 배경선과 함께 여러 카드를 배치
 */
export function WorkloadStatusGrid({
  data,
  columns = 4,
  cardSize = 136,
  gap = 12,
  onCardClick,
}: WorkloadStatusGridProps) {
  const handleCardClick = (item: WorkloadStatusData, index: number) => {
    if (onCardClick) {
      onCardClick(item, index);
    }
  };

  return (
    <GridContainer columns={columns} gap={gap}>
      {data.map((item, index) => (
        <CardWrapper
          key={`${item.type}-${index}`}
          onClick={() => handleCardClick(item, index)}
          $clickable={!!onCardClick}
        >
          <WorkloadStatusCard
            type={item.type}
            count={item.count}
            label={item.label}
            size={cardSize}
          />
        </CardWrapper>
      ))}
    </GridContainer>
  );
}

const GridContainer = styled.div<{ columns: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: 0px;
  justify-items: center;
  align-items: flex-end;
  position: relative;
  border-radius: 4px;
  background: transparent; /* 배경 제거 */

  /* 하단 기준선 (x축) - 점선을 가리도록 높은 z-index */
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #3c4359;
    z-index: 10; /* 점선보다 위에 표시 */
  }

  /* 왼쪽 시작 세로선 (y축) */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 1px;
    background-color: #3c4359;
    z-index: 10; /* 점선보다 위에 표시 */
  }
`;

const CardWrapper = styled.div<{ $clickable: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  position: relative;
  z-index: 1;
  width: 100%;

  /* 세로 구분선 - 마지막 아이템 제외하고 우측에 선 추가 */
  &:not(:last-child)::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 1px;
    background-color: #3c4359;
    z-index: 10; /* 점선보다 위에 표시 */
  }
`;
