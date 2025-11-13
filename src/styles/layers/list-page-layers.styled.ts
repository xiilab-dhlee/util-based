"use client";

import styled from "styled-components";

/**
 * 목록 페이지 왼쪽 사이드바 컨테이너
 * 너비를 설정할 수 있는 세로 방향 레이아웃
 */
export const ListPageAside = styled.div<{
  $width: number;
}>`
  min-width: ${({ $width }) => $width}px;
  max-width: ${({ $width }) => $width}px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/**
 * 목록 페이지 메인 컨텐츠 영역
 * 그림자와 둥근 모서리가 있는 메인 컨텐츠 영역
 */
export const ListPageBody = styled.div`
  flex: 1;
  /* height: 100%; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  padding: 16px 24px;
  background-color: #fafafa;
`;

/**
 * 목록 페이지 메인 레이아웃 컨테이너
 * 가로 방향으로 사이드바와 컨텐츠를 배치하는 메인 컨테이너
 */
export const ListPageMain = styled.section`
  display: flex;
  flex-direction: row;
  gap: 20px;
  min-height: calc(
    100vh - var(--page-title-height) - var(--page-margin-bottom)
  );
`;

/**
 * 목록 래퍼 컴포넌트
 * 목록 내용을 감싸는 컨테이너
 */
export const ListWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;
/**
 * 목록 그리드 컨테이너
 * CSS Grid의 auto-fill과 minmax를 사용하여 컨테이너 너비에 따라
 * 고정된 컬럼 개수가 결정되도록 설정 (요소 개수와 무관)
 */
export const GridList = styled.div`
  display: grid;
  gap: 8px;
  overflow-y: auto;
  height: 100%;
  width: 100%;

  /* CSS Grid를 사용한 고정 컬럼 조정 */
  /* auto-fill: 요소 개수와 상관없이 컨테이너 너비에 맞춰 컬럼 개수 결정 */
  /* 각 그리드 아이템의 최소 너비를 280px로 설정 */
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  /* 그리드 아이템이 늘어나지 않도록 설정 */
  grid-auto-rows: min-content;
`;

export const ListSectionTitle = styled.h3`
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  color: #000;
`;
