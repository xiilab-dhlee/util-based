"use client";

import styled from "styled-components";

import { subTitleStyle } from "@/styles/mixins/text";

/**
 * 상세 페이지 아티클 컨테이너
 * 워크로드 정보를 표시하는 카드 형태의 컨테이너
 */
export const DetailContentArticle = styled.article`
  background-color: #fcfcfc;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  padding: 19px 0;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  overflow: hidden;
`;

/**
 * 상세 페이지 액션 버튼
 * 모니터링, 삭제 등의 액션을 수행하는 버튼
 */
export const DetailContentButton = styled.button`
  border-radius: 2px;
  border: 1px solid #b9bec3;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #000;
  font-size: 12px;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  --icon-fill: #404040;

  &:hover {
    background: #f5f5f5;
    border-color: #a0a0a0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active {
    background: #e5e5e5;
  }
`;

/**
 * 상세 페이지 헤더
 * 타이틀과 도구 버튼들을 포함하는 헤더 영역
 */
export const DetailContentHeader = styled.div`
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

/**
 * 상세 페이지 서브타이틀
 * 왼쪽에 파란색 선이 있는 섹션 제목
 */
export const DetailContentSubTitle = styled.h3`
  ${subTitleStyle(5)}

  font-size: 14px;
  margin-left: 5px;
  margin-bottom: 14px;
`;

/**
 * 상세 페이지 타이틀
 * 16px 굵은 메인 제목
 */
export const DetailContentTitle = styled.h2`
  color: #000;
  font-weight: 700;
  font-size: 16px;
  margin: 0;
`;

/**
 * 상세 페이지 타이틀 영역의 도구 버튼 컨테이너
 * 오른쪽 정렬된 액션 버튼들을 감싸는 컨테이너
 */
export const DetailContentTitleTool = styled.div`
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

/**
 * 상세 페이지 섹션
 * 상세 페이지 내용을 감싸는 섹션
 */
export const DetailContentSection = styled.section`
  padding: 18px 24px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
`;

/**
 * 상세 페이지 왼쪽 사이드바 컨테이너
 * 400px 고정 너비의 세로 방향 레이아웃
 */
export const DetailPageAside = styled.div`
  min-width: 400px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/**
 * 상세 페이지 메인 레이아웃 컨테이너
 * 가로 방향으로 사이드바와 컨텐츠를 배치하는 메인 컨테이너
 */
export const DetailPageBody = styled.section`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 20px;
  min-height: calc(
    100vh - var(--page-title-height) - var(--page-margin-bottom)
  );
`;

/**
 * 상세 페이지 메인 컨텐츠 영역
 * 그림자와 둥근 모서리가 있는 메인 컨텐츠 영역
 */
export const DetailPageContent = styled.div`
  flex: 1;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
`;

export const DetailContentKey = styled.div`
  color: #484848;
  font-weight: 600;
  font-size: 12px;
`;
