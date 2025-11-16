"use client";
import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

/**
 * EmptyFile 컴포넌트
 *
 * 폴더나 디렉토리가 비어있을 때 표시되는 빈 상태 UI 컴포넌트입니다.
 * 사용자에게 해당 위치에 파일이 없다는 것을 시각적으로 알려줍니다.
 *
 * @returns 빈 폴더 상태를 나타내는 JSX 요소
 */
export function EmptyFile() {
  return (
    <Container>
      {/* 폴더 아이콘을 표시하는 래퍼 */}
      <IconWrapper>
        <MyIcon name="Folder" size={48} />
      </IconWrapper>
      {/* 빈 상태 메시지 텍스트 */}
      <EmptyText>선택된 폴더에 파일이 없습니다</EmptyText>
    </Container>
  );
}

const Container = styled.div`
  grid-column: 1 / -1; /* 그리드에서 전체 너비 차지 */
  display: flex;
  flex-direction: column;
  align-items: center; /* 가로 중앙 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  padding: 40px;
  color: #686c70; /* 회색 텍스트 색상 */
`;

const IconWrapper = styled.div`
  margin-bottom: 16px; /* 텍스트와의 간격 */
  opacity: 0.5; /* 아이콘 투명도 조정 */
`;

const EmptyText = styled.div`
  font-size: 14px;
  font-weight: 400;
`;
