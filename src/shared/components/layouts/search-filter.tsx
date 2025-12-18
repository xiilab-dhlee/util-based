"use client";

import classNames from "classnames";
import type { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

import { SELECTOR } from "@/shared/constants/selector.constant";
import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";

interface MySearchFilterProps {
  // 제목
  title: string | ReactNode;
  // 총 개수
  total?: number;
  // 단위
  unit?: string;
  // 다크 모드
  darkMode?: boolean;
  // 총 개수 표시 여부
  showTotal?: boolean;
  // 테스트용 페이지 식별자 (예: "workload", "sourcecode")
  testIdPage?: string;
}
// 검색 필터 컴포넌트
export function MySearchFilter({
  title,
  total = 0,
  unit = "개",
  children,
  darkMode = false,
  showTotal = true,
  testIdPage,
}: PropsWithChildren<MySearchFilterProps>) {
  return (
    <Container
      data-testid={testIdPage ? SELECTOR.listFilter(testIdPage) : undefined}
    >
      <Left>
        <Title className={classNames({ dark: darkMode })}>{title}</Title>

        {showTotal && (
          <Total
            className={classNames({ dark: darkMode })}
            data-testid={
              testIdPage ? SELECTOR.listTotalCount(testIdPage) : undefined
            }
          >
            총 {total.toLocaleString()}
            {unit}
          </Total>
        )}
      </Left>
      <Right>{children}</Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  height: 30px;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;

const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  gap: 6px;
`;

const Title = styled(ListSectionTitle)`
  &.dark {
    color: #fff;
  }
`;

const Total = styled.div`
  font-weight: 500;
  font-size: 12px;
  color: #333333;

  &.dark {
    color: #a3afd0;
  }
`;
