import styled from "styled-components";
import { Tag, Tooltip } from "xiilab-ui";

import type { RequestResourceMigGpuType } from "@/domain/request-resource/schemas/request-resource.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface ColumnMigProps {
  migProfiles: RequestResourceMigGpuType;
}

/**
 * MIG 툴팁 내용 컴포넌트 props
 */
interface MigTooltipContentProps {
  migProfiles: RequestResourceMigGpuType;
}

/**
 * MIG GPU 프로파일을 표시하는 컬럼 컴포넌트
 * @param migProfiles MIG 프로파일 배열 (예: [{ "1g.5gb": 7 }, { "2g.10gb": 3 }])
 */
export function ColumnMig({ migProfiles }: ColumnMigProps) {
  if (migProfiles.length === 0) {
    return <ColumnAlignCenterWrap>-</ColumnAlignCenterWrap>;
  }

  // 첫 번째 프로파일의 키와 값 추출
  const firstProfile = migProfiles[0];
  const firstProfileEntries = Object.entries(firstProfile);

  if (firstProfileEntries.length === 0) {
    return <ColumnAlignCenterWrap>-</ColumnAlignCenterWrap>;
  }

  const [profileName, count] = firstProfileEntries[0];

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

function MigTooltipContent({ migProfiles }: MigTooltipContentProps) {
  return (
    <TooltipContainer>
      <TooltipTitle>MIG 요청량</TooltipTitle>
      <TooltipDivider />
      <TooltipList>
        {migProfiles.map((profile) => {
          const entries = Object.entries(profile);

          if (entries.length === 0) {
            return null;
          }

          const [name, count] = entries[0];
          return (
            <TooltipRow key={name}>
              <TooltipProfileName>{name}</TooltipProfileName>
              <TooltipCount>{count}개</TooltipCount>
            </TooltipRow>
          );
        })}
      </TooltipList>
    </TooltipContainer>
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
