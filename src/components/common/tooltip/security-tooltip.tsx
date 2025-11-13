import styled from "styled-components";
import { Tooltip } from "xiilab-ui";

interface SecurityTooltipProps {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function SecurityTooltip({
  critical,
  high,
  medium,
  low,
}: SecurityTooltipProps) {
  const total = critical + high + medium + low;
  return (
    <Tooltip
      placement="bottom"
      theme="light"
      maxWidth={380}
      title={
        <SecurityWrapper>
          <SecurityKey>취약점 :</SecurityKey>
          <SecurityValue>
            <SecurityLevel className="critical">Critical</SecurityLevel>
            <SecurityCount>{critical}개</SecurityCount>
          </SecurityValue>
          <SecurityValue>
            <SecurityLevel className="high">High</SecurityLevel>
            <SecurityCount>{high}개</SecurityCount>
          </SecurityValue>
          <SecurityValue>
            <SecurityLevel className="medium">Medium</SecurityLevel>
            <SecurityCount>{medium}개</SecurityCount>
          </SecurityValue>
          <SecurityValue>
            <SecurityLevel className="low">Low</SecurityLevel>
            <SecurityCount>{low}개</SecurityCount>
          </SecurityValue>
        </SecurityWrapper>
      }
    >
      <span>{total}개</span>
    </Tooltip>
  );
}


const SecurityWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SecurityKey = styled.span`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  color: #484848;
  white-space: nowrap;
  margin-right: 4px;
`;

const SecurityValue = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  white-space: nowrap;

  & + & {
    margin-left: 14px;
  }
`;

const SecurityCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #000;
  white-space: nowrap;
`;

const SecurityLevel = styled.span`
  font-weight: 600;
  font-size: 10px;
  line-height: 12px;
  white-space: nowrap;

  &.critical {
    color: var(--critical-text-color);
  }

  &.high {
    color: var(--high-text-color);
  }

  &.medium {
    color: var(--medium-text-color);
  }

  &.low {
    color: var(--low-text-color);
  }
`;
