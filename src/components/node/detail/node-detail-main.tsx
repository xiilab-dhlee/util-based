"use client";

import styled from "styled-components";

import NodePrimaryPane from "./node-primary-pane";
import NodeSecondaryPane from "./node-secondary-pane";

/**
 * NodeDetailMain 컴포넌트
 *
 * 노드 상세 페이지의 메인 레이아웃을 구성하는 컴포넌트입니다.
 * 노드의 기본 정보를 표시하는 PrimaryPane과 상세 정보를 표시하는 SecondaryPane을
 * 수평으로 배치하여 노드의 전체 정보를 한눈에 볼 수 있도록 합니다.
 *
 * @returns 노드 상세 페이지의 메인 레이아웃 컴포넌트
 */
export function NodeDetailMain() {
  return (
    <Container>
      {/* 노드의 기본 정보를 표시하는 영역 */}
      <NodePrimaryPane />
      {/* 노드의 상세 정보를 표시하는 영역 */}
      <NodeSecondaryPane />
    </Container>
  );
}


/**
 * 노드 상세 페이지 메인 컨테이너 스타일
 * PrimaryPane과 SecondaryPane을 수평으로 배치하는 레이아웃입니다.
 */
const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  height: 100%;
`;
