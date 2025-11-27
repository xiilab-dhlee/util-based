import styled from "styled-components";
import { Icon, Tooltip, type TooltipProps } from "xiilab-ui";

// import { GuideIcon } from "../icon/guide-icon";

interface GuideTooltipProps extends TooltipProps {}

export function GuideTooltip({ ...props }: GuideTooltipProps) {
  return (
    <Tooltip {...props} theme="light" placement="right">
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

  position: absolute;
  top: 50%;
  left: calc(100% + 2px);
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
`;
