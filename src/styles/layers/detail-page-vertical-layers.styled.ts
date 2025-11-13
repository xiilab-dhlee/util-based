"use client";

import styled from "styled-components";

export const DetailContentPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

export const DetailContentPaneBody = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
  border-radius: 4px;
  padding: 20px;
`;

export const DetailContentFeature = styled.div`
  width: 100%;
  padding: 20px 0;

  &.first {
    padding-top: 0;
  }

  &.last {
    padding-bottom: 0;
  }

  & + & {
    border-top: 1px solid #e0e0e0;
  }
`;

export const DetailContentPaneValue = styled.div`
  text-align: right;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #000;
  flex: 1;
`;

export const DetailContentFeatureBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DetailContentFeaturePane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow: hidden;

  & + & {
    margin-left: 20px;
    border-left: 1px solid #e0e0e0;
    padding-left: 20px;
  }
`;

export const DetailContentFeatureRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
  gap: 10px;
`;

export const DetailContentFeatureGridBody = styled.div`
  display: grid;
  gap: 12px;
  overflow-y: auto;
  height: 100%;
  width: 100%;

  /* CSS Grid를 사용한 고정 컬럼 조정 */
  /* auto-fill: 요소 개수와 상관없이 컨테이너 너비에 맞춰 컬럼 개수 결정 */
  /* 각 그리드 아이템의 최소 너비를 280px로 설정 */
  grid-template-columns: repeat(auto-fill, minmax(249px, 1fr));

  /* 그리드 아이템이 늘어나지 않도록 설정 */
  grid-auto-rows: min-content;
`;
