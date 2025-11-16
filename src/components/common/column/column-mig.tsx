import styled from "styled-components";
import { Tag } from "xiilab-ui";

import type { WorkspaceRequestResourceMigGpuType } from "@/schemas/workspace-request-resource.schema";
import { ColumnAlignCenterWrap } from "../../../styles/layers/column-layer.styled";

interface ColumnMigProps {
  migProfiles: WorkspaceRequestResourceMigGpuType;
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
  const [profileName, count] = Object.entries(firstProfile)[0];

  return (
    <ColumnAlignCenterWrap>
      <ProfileWrapper>
        <ProfileItem>{profileName}</ProfileItem>
        <ProfileItem>{count}개</ProfileItem>
      </ProfileWrapper>
      {migProfiles.length > 1 && (
        <Tag variant="gray">+{migProfiles.length - 1}</Tag>
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
