import styled from "styled-components";

import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";

interface SecurityTotalColumnHeaderProps {
  label?: string;
}

export function SecurityTotalColumnHeader({
  label = "총 취약점 개수",
}: SecurityTotalColumnHeaderProps) {
  return (
    <HeaderTitleWithTooltip>
      <span>{label}</span>
      <GuideTooltip
        placement="bottom"
        title={
          <>
            마우스를 올리면 등급별(Critical, High, Medium, Low)
            <br /> <EmphasisText>취약점 개수가 표시</EmphasisText>
            됩니다.
          </>
        }
      />
    </HeaderTitleWithTooltip>
  );
}

const HeaderTitleWithTooltip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const EmphasisText = styled.span`
  color: var(--color-blue-04);
`;
