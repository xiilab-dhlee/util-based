"use client";

import { Flex } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";
import { Pagination } from "xiilab-ui";

interface ListPageFooterProps {
  /** 총 개수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지 크기 */
  pageSize: number;
  /** 페이지 변경 핸들러 */
  onChange: (page: number) => void;
  /** 로딩 여부 */
  isLoading?: boolean;
  /** 오른쪽 컴포넌트 */
  rightChildren?: ReactNode;
  /** 왼쪽 컴포넌트 */
  leftChildren?: ReactNode;
  /** 페이지네이션 data-testid (외부에서 지정) */
  paginationTestId?: string;
}

/**
 * 목록 푸터 컴포넌트
 *
 * 페이지네이션과 좌우 슬롯을 포함하는 목록 하단 영역입니다.
 */
export function ListPageFooter({
  total,
  page,
  pageSize,
  onChange,
  rightChildren,
  leftChildren,
  paginationTestId,
}: ListPageFooterProps) {
  return (
    <Container justify="space-between" align="center">
      <div>{leftChildren}</div>
      <div>
        <Pagination
          data-testid={paginationTestId}
          current={page}
          total={total}
          pageSize={pageSize}
          onChange={onChange}
        />
      </div>
      <div>{rightChildren}</div>
    </Container>
  );
}

const Container = styled(Flex)`
  width: 100%;
  margin-top: 12px;
  height: 30px;
`;
