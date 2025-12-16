"use client";

import type { ReactNode } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import styled from "styled-components";

interface CustomScrollbarsProps {
  children: ReactNode;
  autoHide?: boolean;
  autoHideTimeout?: number;
  autoHideDuration?: number;
}

/**
 * 프로젝트 전역에서 사용하는 커스텀 스크롤바 컴포넌트
 *
 * react-custom-scrollbars를 래핑하여 일관된 스타일을 적용합니다.
 * 전역 CSS 스크롤바 스타일과 동일한 디자인을 유지합니다.
 *
 * @example
 * ```tsx
 * <ScrollWrapper>
 *   <CustomScrollbars>
 *     <Content />
 *   </CustomScrollbars>
 * </ScrollWrapper>
 * ```
 */
export function CustomScrollbars({
  children,
  autoHide = true,
  autoHideTimeout = 1000,
  autoHideDuration = 200,
}: CustomScrollbarsProps) {
  return (
    <StyledScrollbars
      autoHide={autoHide}
      autoHideTimeout={autoHideTimeout}
      autoHideDuration={autoHideDuration}
      renderView={(props) => <ScrollView {...props} />}
      renderTrackVertical={(props) => <ScrollTrack {...props} />}
      renderThumbVertical={(props) => <ScrollThumb {...props} />}
    >
      {children}
    </StyledScrollbars>
  );
}

const StyledScrollbars = styled(Scrollbars)`
  overflow: visible !important;
`;

/**
 * 스크롤 뷰 스타일
 * 네이티브 스크롤바를 CSS로 숨깁니다.
 */
const ScrollView = styled.div`
  padding-right: 10px;

  /* 네이티브 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ScrollTrack = styled.div`
  position: absolute;
  right: -15px;
  top: 2px;
  bottom: 2px;
  width: 8px;
`;

const ScrollThumb = styled.div`
  width: 4px;
  background: #dddddd;
  border-radius: 4px;
`;
