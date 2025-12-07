"use client";
import type { CSSProperties, PropsWithChildren } from "react";
import styled from "styled-components";

import { useScrollShadow } from "@/shared/hooks/useScrollShadow";
import { hideScrollbar } from "@/styles/mixins/scrollbar";

interface ScrollShadowContainerProps {
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
  /**
   * 인라인 스타일
   */
  style?: CSSProperties;
  /**
   * Shadow 색상 (기본값: rgba(0, 0, 0, 0.2))
   */
  shadowColor?: string;
  /**
   * Shadow 높이 (기본값: 20px)
   */
  shadowHeight?: number;
}

/**
 * 스크롤 가능할 때 하단에 자동으로 box-shadow를 표시하는 컨테이너
 * 스크롤이 끝까지 내려가면 shadow가 사라집니다.
 *
 * @example
 * ```tsx
 * <ScrollShadowContainer>
 *   <div>내용 1</div>
 *   <div>내용 2</div>
 *   <div>내용 3</div>
 * </ScrollShadowContainer>
 * ```
 */
export function ScrollShadowContainer({
  children,
  className,
  style,
  shadowColor = "rgba(0, 0, 0, 0.2)",
  shadowHeight = 20,
}: PropsWithChildren<ScrollShadowContainerProps>) {
  const [scrollRef, showShadow] = useScrollShadow();

  return (
    <Wrapper
      className={className}
      style={style}
      $showShadow={showShadow}
      $shadowColor={shadowColor}
      $shadowHeight={shadowHeight}
    >
      <ScrollableContent ref={scrollRef}>{children}</ScrollableContent>
    </Wrapper>
  );
}

const Wrapper = styled.div<{
  $showShadow: boolean;
  $shadowColor: string;
  $shadowHeight: number;
}>`
  position: relative;
  overflow: hidden;

  /* 스크롤이 가능할 때 viewport 하단에 고정된 box-shadow 표시 */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $shadowHeight }) => $shadowHeight}px;
    pointer-events: none;
    opacity: ${({ $showShadow }) => ($showShadow ? 1 : 0)};
    box-shadow: inset 0 -10px 10px -10px ${({ $shadowColor }) => $shadowColor};
    transition: opacity 0.2s ease;
    z-index: 1;
  }
`;

const ScrollableContent = styled.div`
  height: 100%;
  overflow-y: auto;

  ${hideScrollbar}
`;
