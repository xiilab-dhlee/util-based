import styled from "styled-components";
import { Tooltip, type TooltipProps } from "xiilab-ui";

import MyIcon from "../icons";

interface GuideTooltipProps extends TooltipProps {}

export function GuideTooltip({ ...props }: GuideTooltipProps) {
  return (
    <Tooltip {...props} theme="light" placement="right">
      <IconWrapper className="tooltip-icon">
        <MyIcon name="guide" color="var(--icon-fill)" size={14} />
        <span className="sr-only">가이드</span>
      </IconWrapper>
    </Tooltip>
  );
}


/** 아이콘 래퍼 */
const IconWrapper = styled.span`
  --icon-fill: #cdd0d4;
`;
