import styled from "styled-components";
import { Tooltip, type TooltipProps } from "xiilab-ui";

import { GuideIcon } from "../icon/guide-icon";

interface GuideTooltipProps extends TooltipProps {}

export function GuideTooltip({ ...props }: GuideTooltipProps) {
  return (
    <Tooltip {...props} theme="light" placement="right">
      <IconWrapper className="tooltip-icon">
        <GuideIcon width={14} height={14} />
        <span className="sr-only">가이드</span>
      </IconWrapper>
    </Tooltip>
  );
}

/** 아이콘 래퍼 */
const IconWrapper = styled.span`
  --icon-fill: #cdd0d4;
`;
