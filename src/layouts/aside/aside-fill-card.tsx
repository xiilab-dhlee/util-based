"use client";
import type { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

interface AsideFillCardProps {
  // 제목 (옵셔널)
  title?: string;
  // 제목 옆에 추가로 표시할 내용 (예: 개수)
  titleExtra?: ReactNode;
}
// 페이지 내 aside 가변 영역 카드
export function AsideFillCard({
  title,
  titleExtra,
  children,
}: PropsWithChildren<AsideFillCardProps>) {
  return (
    <Container>
      {/* title이 있는 경우에만 제목 영역 렌더링 */}
      {title && (
        <Header>
          <Title>{title}</Title>
          {titleExtra && <TitleExtra>{titleExtra}</TitleExtra>}
        </Header>
      )}
      <Body>{children}</Body>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  border-radius: 10px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 13px;
`;

const Title = styled(ListSectionTitle)``;

const TitleExtra = styled.span`
  font-family: Pretendard;
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000000;
`;

const Body = styled.div`
  flex: 1;
  gap: 8px;
  overflow-y: auto;

  ${hideScrollbar}
`;
