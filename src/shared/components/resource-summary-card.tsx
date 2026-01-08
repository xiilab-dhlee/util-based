import { isNil } from "es-toolkit";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type { WorkspaceResourceRequest } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

interface ResourceSummaryCardProps {
  resource: WorkspaceResourceRequest | undefined;
}

export function ResourceSummaryCard({ resource }: ResourceSummaryCardProps) {
  // 리소스 값 추출
  const normalGpuCount = resource?.gpu?.detail?.normal?.requestCount;
  const mpsCount = resource?.gpu?.detail?.mps?.requestCount;
  const migProfiles = resource?.gpu?.detail?.mig;
  const cpuCore = resource?.cpu?.requestCore;
  const memoryByte = resource?.memory?.requestByte;

  const hasMig = migProfiles && migProfiles.length > 0;

  const gpuInfo = getResourceInfo("GPU");
  const migInfo = getResourceInfo("MIG");
  const mpsInfo = getResourceInfo("MPS");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");

  // 값이 없으면 "-" 표시
  const displayGpuCount = isNil(normalGpuCount)
    ? "-"
    : `${normalGpuCount}${gpuInfo.unit}`;
  const displayCpuCore = isNil(cpuCore) ? "-" : `${cpuCore}${cpuInfo.unit}`;
  const displayMemory = isNil(memoryByte)
    ? "-"
    : `${convertBytes(memoryByte, "GB", 0).value}${memInfo.unit}`;
  const displayMpsCount = isNil(mpsCount) ? "-" : `${mpsCount}${mpsInfo.unit}`;

  const renderMigProfiles = () => {
    if (!migProfiles) return null;

    return migProfiles.flatMap((mig, index) => {
      const isNewRow = index > 0 && index % 4 === 0;
      const isEndOfRow = index % 4 === 3 || index === migProfiles.length - 1;

      return [
        ...(isNewRow
          ? [<MigRowDivider key={`div-${index}`} aria-hidden />]
          : []),
        <MigProfileItem
          key={`${mig.profile}-${index}`}
          $isEndOfRow={isEndOfRow}
        >
          <MigProfileLine>{mig.profile}</MigProfileLine>
          <MigProfileLine>
            {mig.requestCount}
            {migInfo.unit}
          </MigProfileLine>
        </MigProfileItem>,
      ];
    });
  };

  return (
    <>
      {/* GPU, CPU, Memory, MPS 테이블 */}
      <ResourceContainer>
        <ResourceTable>
          <ResourceRow>
            <ResourceCell>
              <ResourceLabel>{gpuInfo.text}</ResourceLabel>
              <ResourceValue>{displayGpuCount}</ResourceValue>
            </ResourceCell>
            <ResourceCell>
              <ResourceLabel>{cpuInfo.text}</ResourceLabel>
              <ResourceValue>{displayCpuCore}</ResourceValue>
            </ResourceCell>
            <ResourceCell>
              <ResourceLabel>{memInfo.text}</ResourceLabel>
              <ResourceValue>{displayMemory}</ResourceValue>
            </ResourceCell>
            <ResourceCell>
              <ResourceLabel>{mpsInfo.text}</ResourceLabel>
              <ResourceValue>{displayMpsCount}</ResourceValue>
            </ResourceCell>
          </ResourceRow>
        </ResourceTable>
      </ResourceContainer>

      {/* MIG 섹션 */}
      {hasMig && (
        <MigContainer>
          <MigHeader>
            <ResourceLabel>{migInfo.text}</ResourceLabel>
            <ResourceCount>
              전체 {migProfiles.length}
              {migInfo.unit}
            </ResourceCount>
          </MigHeader>
          <MigProfilesWrap>{renderMigProfiles()}</MigProfilesWrap>
        </MigContainer>
      )}
    </>
  );
}

const ResourceContainer = styled.div`
  border: 1px solid var(--color-gray-10);
  border-radius: 2px;
  overflow: hidden;
`;

const MigContainer = styled.div`
  border: 1px solid var(--color-gray-10);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 8px;
`;

const ResourceTable = styled.div`
  display: table;
  width: 100%;
  border-collapse: collapse;
`;

const ResourceRow = styled.div`
  display: table-row;
`;

const ResourceCell = styled.div`
  display: table-cell;
  padding: 8px 12px;
  text-align: center;
  vertical-align: middle;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    height: 70%;
    background: var(--color-gray-10);
    transform: translateY(-50%);
  }

  &:last-child {
    &::after {
      display: none;
    }
  }
`;

const ResourceLabel = styled(Typography.Text).attrs({
  variant: "body-2-3",
})`
`;

const ResourceValue = styled(Typography.Text).attrs({
  variant: "body-2-3",
})`
  margin-top: 6px;
`;

const MigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
`;

const ResourceCount = styled(Typography.Text).attrs({
  variant: "body-3-3",
})`
  display: block;
  color: var(--color-gray-03);
`;

const MigProfilesWrap = styled.div`
  position: relative;
  padding: 0px 6px;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid var(--color-gray-10);
`;

const MigRowDivider = styled.div`
  flex-basis: 100%;
  width: 100%;
  height: 0;
  margin: 0 6px;
  border-top: 1px solid var(--color-gray-10);
`;

type MigProfileItemProps = {
  $isEndOfRow: boolean;
};

const MigProfileItem = styled(Typography.Text).attrs({
  variant: "body-2-3",
})<MigProfileItemProps>`
  display: block;
  flex: 0 0 25%;
  max-width: 25%;
  padding: 6px 8px;
  text-align: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    height: 30%;
    background: var(--color-gray-10);
    transform: translateY(-50%);
    display: ${({ $isEndOfRow }) => ($isEndOfRow ? "none" : "block")};
  }
`;

const MigProfileLine = styled.span`
  display: block;
  word-break: break-word;
`;
