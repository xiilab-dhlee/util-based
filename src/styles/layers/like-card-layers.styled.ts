"use client";

import styled from "styled-components";

/**
 * 모니터링 카드 컨테이너 스타일
 *
 * 카드 형태의 디자인을 제공하며 내부 콘텐츠를 감싸는 역할을 합니다.
 *
 * 스타일 특징:
 * - 테두리와 그림자를 통한 카드 형태 구현
 * - 내부 그림자로 하이라이트 효과 제공
 * - 외부 그림자로 깊이감 표현
 * - 세로 방향 레이아웃으로 헤더와 본문 구성
 * - 넘치는 내용은 숨김 처리
 */
export const LikeCompactCardContainer = styled.div`
  border: 1px solid #d1d5dc; // 테두리 색상
  width: 100%;
  height: 100%;
  background-color: #f7f9fb; // 연한 파란색 배경
  border-radius: 4px; // 모서리 둥글게
  box-shadow: 0px 4px 4px 0px #ffffff40 inset; // 내부 그림자 (하이라이트 효과)
  box-shadow: 0px 4px 4px 0px #ababab26; // 외부 그림자 (깊이감)
  display: flex;
  flex-direction: column; // 세로 방향 레이아웃
  overflow: hidden; // 넘치는 내용 숨김
  padding: 10px; // 내부 여백
`;

/**
 * 카드 헤더 스타일
 *
 * 메트릭 이름과 확대 버튼을 가로로 배치하며, 제목이 길 경우
 * 말줄임표 처리를 위한 overflow 설정을 포함합니다.
 */
export const LikeCompactCardHeader = styled.div`
  display: flex;
  justify-content: space-between; // 제목과 버튼을 양쪽 끝에 배치
  align-items: center;
  gap: 20px; // 제목과 버튼 사이 간격
  overflow: hidden; // 넘치는 내용 숨김 (말줄임표 처리)
  margin-bottom: 7px; // 하단 여백
`;

/**
 * 메트릭 제목 스타일
 *
 * 메트릭 이름을 표시하며 남은 공간을 모두 차지합니다.
 * 텍스트가 길 경우 말줄임표 처리를 위해 부모의 overflow 설정과 연동됩니다.
 */
export const LikeCompactCardTitle = styled.div`
  flex: 1; // 남은 공간 모두 차지
  color: #191b26; // 진한 회색 텍스트
  font-weight: 600; // 굵은 글씨
  font-size: 14px; // 적당한 글씨 크기
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;

/**
 * 카드 본문 스타일
 *
 * 모니터링 차트를 표시하는 영역으로, 차트가 들어갈 수 있도록
 * 적절한 테두리와 배경색을 설정합니다.
 */
export const LikeCompactCardBody = styled.div`
  border: 1px solid #e9ebee; // 연한 회색 테두리
  border-radius: 4px; // 모서리 둥글게
  background-color: #fff; // 흰색 배경
  width: 100%;
  flex: 1; // 남은 공간 모두 차지
`;

export const LikeCompactCardRecord = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow: hidden;
  gap: 4px;
`;

export const LikeCompactCardKey = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #191b26;
`;

export const LikeCompactCardValue = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #191b26;
  flex: 1;
`;
