"use client";

import styled from "styled-components";

import { customScrollbar } from "@/styles/mixins/scrollbar";

/**
 * 상세 페이지 아티클 컨테이너
 * 워크로드 정보를 표시하는 카드 형태의 컨테이너
 */
export const DetailIntroCardContainer = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding-top: 14px;
  background-color: #171b26;
  padding: 24px;
  overflow: hidden;
`;

/**
 * 카드 헤더 영역
 * 워크로드 이름과 도구 버튼들을 좌우로 배치
 */
export const DetailIntroCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

/**
 * 카드 본문 영역
 * 워크로드 상세 정보들을 세로로 배치
 */
export const DetailIntroCardBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

/**
 * 정보 행 기본 스타일
 * 각 정보 섹션(상태, 라벨)을 위한 공통 스타일
 */
export const DetailIntroCardRow = styled.div`
  display: flex;
  flex-direction: column;
  background: #070913;
  border: 1px solid #2a3041;
  padding: 8px 10px;
  border-radius: 4px;
  overflow: hidden;
`;

/**
 * 설명 정보 행
 * 확장 가능한 높이를 가진 설명 전용 행
 */
export const DetailIntroCardDescriptionRow = styled(DetailIntroCardRow)`
  flex: 1;
`;

/**
 * 행 본문 영역
 * 아이콘과 제목을 포함하는 상단 영역
 */
export const DetailIntroCardRowBody = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-weight: 700;
  font-size: 12px;
  color: #f5f5f5;
`;

/**
 * 설명 행 본문 영역
 * 하단 여백이 추가된 설명 전용 본문
 */
export const DetailIntroCardDescriptionRowBody = styled(DetailIntroCardRowBody)`
  margin-bottom: 6px;
`;

/**
 * 행 제목 영역
 * 각 정보 섹션의 제목을 표시
 */
export const DetailIntroCardRowTitle = styled.div`
  display: inline-block;
  height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

/**
 * 제목 표시 영역
 * 긴 이름에 대한 텍스트 자르기 처리
 */
export const DetailIntroCardTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #f5f5f5;
  flex: 1;
  overflow: hidden;
`;

/**
 * 행 아이콘 래퍼
 * 각 정보 행의 아이콘을 위한 스타일링
 */
export const DetailIntroCardRowIconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #343c50;
  width: 30px;
  height: 30px;
  border-radius: 2px;
  margin-right: 8px;

  --icon-fill: #e8eaed;
`;

/**
 * 설명 텍스트
 * 긴 설명에 대한 스크롤 처리
 */
export const DetailIntroCardDescription = styled.p`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #cbcbcb;
  overflow-y: auto;
  flex: 1;

  ${customScrollbar("#2A3041")}

  & + & {
    border-top: 1px solid #2a3041;
    padding-top: 10px;
  }
`;
