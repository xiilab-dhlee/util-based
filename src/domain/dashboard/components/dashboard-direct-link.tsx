import styled from "styled-components";

import { ArrowIcon } from "@/shared/components/icon/arrow-icon";

interface DashboardDirectLinkProps {
  className?: string;
}
/**
 * 다이렉트 링크 컴포넌트
 * @param className - 클래스 이름
 * @param linkProps - 링크 속성
 * @returns 다이렉트 링크 컴포넌트
 */
export function DashboardDirectLink({ className }: DashboardDirectLinkProps) {
  return (
    <Container className={className}>
      <ArrowIcon />
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  border-width: 1px;
  border-style: solid;

  & svg {
    transform: rotate(-90deg);
  }

  &.dark {
    border-color: #343c50;
    background-color: #070913;
    --icon-fill: #fafafa;
  }

  &.light {
    border-color: #f6f6f9;
  }
`;
