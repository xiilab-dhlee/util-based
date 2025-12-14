"use client";

import styled from "styled-components";
import { Box } from "xiilab-ui";

/* =============================================================================
   타입 정의
============================================================================= */

interface SelectableBoxProps {
  /** 아이콘 (선택) */
  icon?: React.ReactNode;
  /** 제목 */
  title: string;
  /** 메타 정보 (부가 정보, 툴팁 등) */
  meta?: React.ReactNode;
  /** 선택 여부 */
  isSelected: boolean;
  /** 비활성화 여부 */
  isDisabled?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 높이 */
  height?: string;
  /** 너비 */
  width?: string;
  /** 레이아웃 방향 (기본: row) */
  direction?: "row" | "column";
}

interface SelectableBoxMetaProps {
  /** 라벨 */
  label: string;
  /** 값 */
  value: string | number;
  /** 단위 */
  unit?: string;
}

/* =============================================================================
   메인 컴포넌트
============================================================================= */

/**
 * 선택 가능한 Box 컴포넌트
 *
 * GPU 선택, GPU 타입, 노드 타입 등에서 공통으로 사용
 */
export function SelectableBox({
  icon,
  title,
  meta,
  isSelected,
  isDisabled = false,
  onClick,
  height = "34px",
  width,
  direction = "row",
}: SelectableBoxProps) {
  const handleClick = isDisabled ? undefined : onClick;

  return (
    <StyledBox
      state={isSelected ? "pressed" : "default"}
      onClick={handleClick}
      height={height}
      width={width}
      $disabled={isDisabled}
    >
      <Content $direction={direction}>
        <TitleRow>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <Title $isSelected={isSelected}>{title}</Title>
        </TitleRow>
        {meta && <MetaWrapper>{meta}</MetaWrapper>}
      </Content>
    </StyledBox>
  );
}

/**
 * SelectableBox의 메타 정보 컴포넌트
 *
 * Memory 8GB 같은 부가 정보 표시
 */
export function SelectableBoxMeta({
  label,
  value,
  unit,
}: SelectableBoxMetaProps) {
  return (
    <MetaContent>
      <MetaLabel>{label}</MetaLabel>
      <MetaValue>
        {value}
        {unit}
      </MetaValue>
    </MetaContent>
  );
}

/* =============================================================================
   스타일 컴포넌트
============================================================================= */

const StyledBox = styled(Box)<{ $disabled?: boolean }>`
  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

const Content = styled.div<{ $direction: "row" | "column" }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  align-items: center;
  justify-content: center;
  gap: ${({ $direction }) => ($direction === "row" ? "4px" : "2px")};
  width: 100%;
  height: 100%;
  padding: ${({ $direction }) => ($direction === "column" ? "8px 16px" : "0")};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.span<{ $isSelected: boolean }>`
  font-family: Pretendard, sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 1.4;
  color: ${({ $isSelected }) => ($isSelected ? "#00144B" : "#000000")};
`;

const MetaWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MetaContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaLabel = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.4;
  color: #787878;
`;

const MetaValue = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 1.4;
  color: #787878;
`;
