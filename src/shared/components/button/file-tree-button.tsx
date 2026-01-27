"use client";

import classNames from "classnames";
import type { PropsWithChildren } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

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
      className={classNames("truncate", {
        active: isActive,
      })}
    >
      {icon?.visible && (
        <IconWrapper>
          <Icon name={icon.name} color={icon.color} size={icon.size} />
        </IconWrapper>
      )}
      {children}
    </Container>
  );
}

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
