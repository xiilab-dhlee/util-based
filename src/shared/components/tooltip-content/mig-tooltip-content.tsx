import styled from "styled-components";

import type { MigProfileResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

/**
 * MIG 툴팁 내용 컴포넌트 props
 */
interface MigTooltipContentProps {
  migProfiles: MigProfileResponse[];
}

export function MigTooltipContent({ migProfiles }: MigTooltipContentProps) {
  const migInfo = getResourceInfo("MIG");

  return (
    <TooltipContainer>
      <TooltipTitle>{migInfo.text}</TooltipTitle>
      <TooltipDivider />
      <TooltipList>
        {migProfiles.map((profile, index) => {
          return (
            <TooltipRow key={`${profile.profile}-${index}`}>
              <TooltipProfileName>{profile.profile}</TooltipProfileName>
              <TooltipCount>
                {formatNumberWithUnit(profile.requestCount, migInfo.unit)}
              </TooltipCount>
            </TooltipRow>
          );
        })}
      </TooltipList>
    </TooltipContainer>
  );
}

const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 80px;
`;

const TooltipTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #000;
  padding-bottom: 6px;
`;

const TooltipDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e9ebee;
  margin-bottom: 6px;
`;

const TooltipList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TooltipRow = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TooltipProfileName = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const TooltipCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;
