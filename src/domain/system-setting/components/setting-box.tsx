"use client";

import type { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

interface SettingBoxProps {
  /** 박스 제목 */
  title: string;
  /** 제목 옆 툴팁 등 추가 요소 */
  titleExtra?: ReactNode;
  /** 오른쪽 영역 (버튼 등) */
  extra?: ReactNode;
  /** 고정 높이 (px) */
  height?: number;
}

export function SettingBox({
  title,
  titleExtra,
  extra,
  height,
  children,
}: PropsWithChildren<SettingBoxProps>) {
  return (
    <Container $height={height}>
      <Header>
        <TitleWrapper>
          <Typography.Text variant="subtitle-2-1">{title}</Typography.Text>
          {titleExtra}
        </TitleWrapper>
        {extra && <Extra>{extra}</Extra>}
      </Header>
      <Body>{children}</Body>
    </Container>
  );
}

const Container = styled.div<{ $height?: number }>`
  background: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  min-height: ${({ $height }) => ($height ? `${$height}px` : "100%")};
  height: 100%;
  min-width: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Extra = styled.div`
  display: flex;
  align-items: center;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
