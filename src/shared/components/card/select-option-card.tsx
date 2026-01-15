"use client";

import styled from "styled-components";

// =============================================================================
// Types
// =============================================================================

interface SelectOptionCardProps {
  /** 카드 상단에 표시될 출처 텍스트 (예: "Workload", "External") */
  from: string;
  /** 카드 제목 */
  title: string;
  /** 선택 시 전달될 타입 값 */
  type: string;
  /** 카드 우측 상단에 표시될 아이콘 (선택적) */
  icon?: React.ReactNode;
  /** 카드 본문에 표시될 설명 텍스트 */
  description: string;
  /** 카드 클릭 시 호출되는 콜백 (type 값 전달) */
  onClick: (type: string) => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * 옵션 선택 카드 컴포넌트
 *
 * 모달 등에서 여러 옵션 중 하나를 선택할 때 사용하는 카드 형태의 버튼입니다.
 * 선택 시 테두리 색상과 그림자가 변경되어 시각적 피드백을 제공합니다.
 */
export function SelectOptionCard({
  from,
  title,
  type,
  icon,
  description,
  onClick,
}: SelectOptionCardProps) {
  return (
    <CardContainer type="button" onClick={() => onClick(type)}>
      {/* 헤더: 출처, 제목, 아이콘 */}
      <CardHeader>
        <HeaderTextGroup>
          <FromText>From {from}</FromText>
          <TitleText>{title}</TitleText>
        </HeaderTextGroup>
        {icon && <IconContainer>{icon}</IconContainer>}
      </CardHeader>

      {/* 본문: 설명 텍스트 */}
      <DescriptionBox>{description}</DescriptionBox>
    </CardContainer>
  );
}

// =============================================================================
// Styled Components
// =============================================================================

/** 카드 컨테이너 - 클릭 가능한 버튼 형태 */
const CardContainer = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;

  background: #fff;
  border: 1px solid #e0e5f0;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;

  &:hover {
    border-color: #1f5bff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.15);
  }
`;

/** 카드 헤더 - 텍스트와 아이콘을 가로 배치 */
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/** 헤더 텍스트 그룹 - 출처와 제목을 세로 배치 */
const HeaderTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

/** 제목 텍스트 */
const TitleText = styled.span`
  font-size: 14px;
  letter-spacing: 0;
  font-weight: 600;
  line-height: 1;
  color: #000;
`;

/** 출처 텍스트 */
const FromText = styled.span`
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
  color: #000;
`;

/** 아이콘 컨테이너 */
const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 42px;

  border: 1px solid #e0e5f0;
  border-radius: 4px;
`;

/** 설명 박스 */
const DescriptionBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 9px 10px;

  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  color: #000;

  background: #fdfeff;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
`;
