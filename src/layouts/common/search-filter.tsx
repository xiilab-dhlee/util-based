"use client";

import classNames from "classnames";
import type { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";

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
}
// 검색 필터 컴포넌트
export function MySearchFilter({
  title,
  total = 0,
  unit = "개",
  children,
  darkMode = false,
  showTotal = true,
}: PropsWithChildren<MySearchFilterProps>) {
  return (
    <Container>
      <Left>
        <Title className={classNames({ dark: darkMode })}>{title}</Title>

        {showTotal && (
          <Total className={classNames({ dark: darkMode })}>
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
