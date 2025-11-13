"use client";

import Link from "next/link";
import styled from "styled-components";

/**
 * NotFound 컴포넌트 (App Router 버전)
 *
 * Next.js 15+ App Router에서 제공하는 특별한 파일로,
 * 존재하지 않는 경로에 접근했을 때 자동으로 렌더링되는 404 페이지입니다.
 *
 * 주요 기능:
 * - 사용자가 존재하지 않는 URL에 접근할 때 표시
 * - 홈페이지로 돌아갈 수 있는 링크 제공
 * - 사용자 친화적인 에러 메시지 표시
 *
 * Next.js App Router 규칙:
 * - 파일명이 'not-found.tsx'여야 함
 * - app 디렉토리 내 어디든 위치 가능 (현재는 루트 레벨)
 * - notFound() 함수 호출 시에도 이 컴포넌트가 렌더링됨
 *
 * 참고: Client Component이므로 metadata는 별도 layout.tsx에서 관리합니다.
 */

export default function NotFound() {
  return (
    <Container>
      <Content>
        {/* 404 에러 제목 */}
        <Title>페이지를 찾을 수 없습니다</Title>
        {/* 사용자에게 상황을 설명하는 메시지 */}
        <Description>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </Description>
        {/* 홈페이지로 돌아가는 링크 버튼 */}
        <HomeLink href="/">홈으로 돌아가기</HomeLink>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  padding: 0 40px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  color: #070913;
  margin-bottom: 1.6rem;
`;

const Description = styled.p`
  font-size: 1.6rem;
  color: #070913;
  margin-bottom: 2.4rem;
  line-height: 1.5;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 1.2rem 2.4rem;
  color: #ffffff;
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease;
  background-color: #5d6dff;

  &:hover {
    background-color: #7274ff;
  }
`;
