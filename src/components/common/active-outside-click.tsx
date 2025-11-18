"use client";
import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";
import styled from "styled-components";

interface Props {
  onClick: () => void;
  children: ReactNode;
}
/**
 * 요소 외부 클릭 이벤트 활성화
 *
 */
export const ActiveOutsideClick: FC<Props> = ({ onClick, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClick();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClick]);

  return <Container ref={ref}>{children}</Container>;
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
