"use client";

import styled from "styled-components";

import { WorkspaceResourceCard } from "./workspace-resource-card";

export function WorkspaceResourcePageAside() {
  return (
    <Container>
      <Header>
        <HeaderTitle>전체 리소스 사용량 및 할당량</HeaderTitle>
      </Header>
      <Body>
        <WorkspaceResourceCard
          resourceType="GPU"
          usage={3333}
          request={6666}
          limit={9999}
        />
        <WorkspaceResourceCard
          resourceType="CPU"
          usage={3333}
          request={6666}
          limit={9999}
        />
        <WorkspaceResourceCard
          resourceType="MEM"
          usage={3333}
          request={6666}
          limit={9999}
        />
      </Body>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * 워크스페이스 소개 카드 메인 컨테이너
 * 고정 높이와 스크롤 처리를 위한 스타일링
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
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
 * 워크스페이스 이름과 도구 버튼들을 좌우로 배치
 */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
`;

/**
 * 카드 본문 영역
 * 워크스페이스 상세 정보들을 세로로 배치
 */
const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

/**
 * 워크스페이스 이름 표시 영역
 * 긴 이름에 대한 텍스트 자르기 처리
 */
const HeaderTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #f5f5f5;
  flex: 1;
  overflow: hidden;
`;
