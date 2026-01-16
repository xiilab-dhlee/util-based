"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Pagination } from "xiilab-ui";

interface ListPageFooterProps {
  // 총 개수
  total: number;
  // 현재 페이지
  page: number;
  // 페이지 크기
  pageSize: number;
  // 페이지 변경 핸들러
  onChange: (page: number) => void;
  // 로딩 여부
  isLoading?: boolean;
  // 오른쪽 컴포넌트
  rightChildren?: ReactNode;
  // 왼쪽 컴포넌트
  leftChildren?: ReactNode;
  // 페이지네이션 data-testid (외부에서 지정)
  paginationTestId?: string;
}
// 목록 푸터 컴포넌트
export function ListPageFooter({
  total,
  page,
  pageSize,
  onChange,
  rightChildren,
  leftChildren,
  paginationTestId,
  isLoading,
}: ListPageFooterProps) {
  return (
    <Container>
      <Left>{leftChildren}</Left>
      <Center>
        <Pagination
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
          data-testid={paginationTestId}
          disabled={isLoading}
        />
      </Center>
      <Right>{rightChildren}</Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  width: 100%;
  margin-top: 12px;
  height: 30px;
`;

const Left = styled.div``;

const Center = styled.div``;

const Right = styled.div``;
