import styled from "styled-components";
import { Tag, Tooltip } from "xiilab-ui";

import type { MigProfileResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { MigTooltipContent } from "@/shared/components/tooltip-content/mig-tooltip-content";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface ColumnMigProps {
  migProfiles: MigProfileResponse[];
}

/**
 * MIG GPU 프로파일을 표시하는 컬럼 컴포넌트
 * @param migProfiles MIG 프로파일 배열 (예: [{ profile: "1g.5gb", requestCount: 7 }, { profile: "2g.10gb", requestCount: 3 }])
 */
export function ColumnMig({ migProfiles }: ColumnMigProps) {
  if (!migProfiles?.length) {
    return <ColumnAlignCenterWrap>-</ColumnAlignCenterWrap>;
  }

  // 첫 번째 프로파일 추출
  const firstProfile = migProfiles[0];
  const profileName = firstProfile.profile;
  const count = firstProfile.requestCount;

  return (
    <ColumnAlignCenterWrap>
      <ProfileWrapper>
        <ProfileItem>{profileName}</ProfileItem>
        <ProfileItem>{count}개</ProfileItem>
      </ProfileWrapper>
      {migProfiles.length > 1 && (
        <Tooltip
          theme="light"
          placement="top"
          title={<MigTooltipContent migProfiles={migProfiles} />}
        >
          <Tag variant="gray">+{migProfiles.length - 1}</Tag>
        </Tooltip>
      )}
    </ColumnAlignCenterWrap>
  );
}

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProfileItem = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
  color: #000;

  & + & {
    border-left: 1px solid #acacac;
    padding-left: 5px;
    margin-left: 5px;
    margin-right: 5px;
  }
`;
