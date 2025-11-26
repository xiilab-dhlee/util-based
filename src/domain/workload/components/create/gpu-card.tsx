"use client";

import classNames from "classnames";
import styled from "styled-components";
import { Icon, Tooltip, Typography } from "xiilab-ui";

import { GpuTooltipTitle } from "@/shared/components/tooltip-title/gpu-tooltip-title";
import type { GpuListType } from "@/shared/schemas/gpu.schema";

interface GpuCardProps extends GpuListType {
  isSelected: boolean;
  onClick: (gpu: GpuListType) => void;
}

export function GpuCard({ isSelected, onClick, ...props }: GpuCardProps) {
  const { name, memory, isAvailable } = props;
  return (
    <Container
      className={classNames({ active: isSelected, error: !isAvailable })}
      onClick={() => onClick(props)}
    >
      <Header>
        {/* 리소스 부족 시 알림 표시 */}
        {!isAvailable && (
          <Tooltip title={<GpuTooltipTitle />}>
            <TooltipWrapper>
              <Icon name="Notice" size={14} color="#FF3535" />
            </TooltipWrapper>
          </Tooltip>
        )}
        <Typography.Text variant="body-2-2" color="#00144B">
          {name}
        </Typography.Text>
      </Header>
      <Body>
        <Typography.Text variant="body-3-2" color="#787878">
          Memory
        </Typography.Text>
        <Typography.Text variant="body-3-3" color="#787878">
          {memory}GB
        </Typography.Text>
      </Body>
    </Container>
  );
}

const Container = styled.button`
  position: relative;
  border-radius: 2px;
  border: 1px solid #B9BEC3;
  background-color: #fafafa;
  padding: 10px 0;
  width: 100%;
  height: 48px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  outline: none;

  &.error {
    border-color: #FF3535 !important;
  }

  &.active {
    border-color: #3d3fdf;
    outline: 1px solid #366BFF1A;
  }

  &:hover {
    border-color: #3d3fdf;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  height: 14px;
`;

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 14px;
  line-height: 1;
  cursor: pointer;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;
