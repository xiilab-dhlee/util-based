import Link from "next/link";
import styled from "styled-components";

// 중앙 정렬
export const ColumnAlignCenterWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 오른쪽 정렬
export const ColumnAlignRightWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

// 왼쪽 정렬
export const ColumnAlignLeftWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

// 라벨 랩퍼
export const ColumnLabelWrap = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

// 아이콘 랩퍼
export const ColumnIconWrap = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e1e4e7;
  background-color: #fafafa;
  border-radius: 2px;
  box-shadow: 0px 2px 4px 0px #0000000a;

  --icon-fill: #404040;

  &:hover {
    border-color: #1f5bff;
  }

  &.active {
    background-color: #544ad8;
    border-color: #7e76e1;
    --icon-fill: #fff;
  }

  &.rotate {
    transform: rotate(180deg);
  }

  &.hide-box {
    background-color: transparent;
    border: none;
  }

  &:disabled {
    background-color: #f3f3f3;
    border-color: #e8e8e8;
    cursor: not-allowed;

    --icon-fill: #d1d1d1;
  }
`;

// 링크 랩퍼
export const ColumnLink = styled(Link)`
  color: #17171f !important;
  text-decoration: none;
`;
// 강조 텍스트
export const ColumnHighlightText = styled.span`
  &.overflow {
    color: #da2b42;
    font-weight: 600;
  }

  &.warning {
    color: #e87b0e;
    font-weight: 600;
  }
`;

export const ColumnTruncateText = styled.span<{ width: number }>`
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${({ width }) => width}px;
`;

export const ColumnTextButton = styled.button`
  color: #17171f !important;
  text-decoration: none;
  &:hover{
    opacity: 0.8;
  }
`;
