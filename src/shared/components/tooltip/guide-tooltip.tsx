"use client";
import type { ReactNode } from "react";
import styled from "styled-components";
import { Icon, Tooltip, type TooltipProps, Typography } from "xiilab-ui";

interface GuideTooltipProps extends Omit<TooltipProps, "title"> {
  title: ReactNode;
}

export function GuideTooltip({
  title,
  maxWidth,
  styles,
  ...props
}: GuideTooltipProps) {
  const mergedStyles =
    maxWidth === undefined
      ? styles
      : {
          ...styles,
          root: {
            ...(styles?.root ?? {}),
            maxWidth,
          },
        };

  return (
    <Tooltip
      theme="light"
      placement="right"
      {...props}
      styles={mergedStyles}
      title={<Typography.Text variant="body-3-3">{title}</Typography.Text>}
      getPopupContainer={() => document.body}
    >
      <IconWrapper className="tooltip-icon">
        <Icon name="Info" size={16} color="#5F6368" />
        <span className="sr-only">가이드</span>
      </IconWrapper>
    </Tooltip>
  );
}

const IconWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`;
