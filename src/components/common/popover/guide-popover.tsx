import { Popover } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";

import { GuideIcon } from "@/components/common/icon/guide-icon";

interface GuidePopoverProps {
  size?: number;
  popupContent: ReactNode;
}

export function GuidePopover({ size = 14, popupContent }: GuidePopoverProps) {
  return (
    <Popover content={popupContent} trigger="hover" placement="right">
      <IconWrapper>
        <GuideIcon width={size} height={size} />
      </IconWrapper>
    </Popover>
  );
}

const IconWrapper = styled.span`
  --icon-fill: #cdd0d4;
`;
