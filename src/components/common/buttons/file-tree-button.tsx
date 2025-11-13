"use client";

import classNames from "classnames";
import type { PropsWithChildren } from "react";
import styled from "styled-components";

import { MyIcon } from "../icons";

/**
 * WorkloadFileButton 컴포넌트의 props 인터페이스
 */
interface FileTreeButtonProps {
  isActive: boolean;
  onClick: () => void;
  icon?: {
    visible: boolean;
    name: string;
    size: number;
    color: string;
  };
}

export function FileTreeButton({
  isActive,
  onClick,
  icon,
  children,
}: PropsWithChildren<FileTreeButtonProps>) {
  return (
    <Container
      type="button"
      onClick={onClick}
      className={classNames({
        active: isActive,
      })}
    >
      {icon?.visible && (
        <IconWrapper>
          <MyIcon name={icon.name} color={icon.color} size={icon.size} />
        </IconWrapper>
      )}
      {children}
    </Container>
  );
}

/**
 * 파일/디렉토리 선택 버튼의 스타일드 컴포넌트
 *
 * - 기본 스타일: 검은색 텍스트, 12px 폰트 크기, 400 폰트 굵기
 * - 레이아웃: flex 1로 남은 공간 차지, 좌측 정렬
 * - 상호작용: hover 시 연한 파란색 배경 (#eef4ff)
 * - 활성 상태: 선택된 노드는 연한 파란색 배경과 600 폰트 굵기
 */
const Container = styled.button`
  color: #000;
  font-size: 12px;
  line-height: 24px;
  font-weight: 400;
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 2px;
  white-space: nowrap;
  padding-left: 3px;

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  &.active {
    background: #eef4ff;
    font-weight: 600;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  transition: all 0.3s;

  --icon-fill: #9da6bc;
`;
