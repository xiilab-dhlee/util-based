"use client";

import styled from "styled-components";
import { Button, Label, Typography } from "xiilab-ui";

import { useGetPolicySet } from "@/api/generated/admin-workspace/admin-workspace";
import {
  useGetClusterTotalResources,
  useGetMigProfiles,
} from "@/api/generated/cluster-resource/cluster-resource";
import { WorkspaceResourceSettingModal } from "@/domain/system-setting/components/workspace-resource-setting-modal";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { TooltipHighlightText } from "@/styles/mixins/text";

/**
 * 시스템 설정 페이지 사이드바
 * AsideFillCard를 사용한 워크스페이스 생성 및 기본 리소스 설정 영역
 */
export function SystemSettingAside() {
  const publish = usePublish();

  // API 데이터 가져오기
  const { data: policySet, isLoading } = useGetPolicySet();
  const { data: clusterTotalResources } = useGetClusterTotalResources();
  const { data: clusterMigProfiles } = useGetMigProfiles();

  const handleEditWorkspaceCount = () => {
    if (!policySet) return;

    publish(SYSTEM_SETTING_EVENTS.openWorkspaceResourceSettingModal, {
      gpu: String(defaultGpuCount ?? 0),
      cpu: String(defaultCpuCore ?? 0),
      memory: String(defaultMemoryGB ?? 0),
      workspaceCount: String(workspaceLimit ?? 0),
      migResources: defaultMigProfiles.map((mig) => ({
        profile: mig.profile,
        count: String(mig.count),
      })),
    });
  };

  // 로딩 완료 후 데이터 없음 → 에러
  if (!isLoading && !policySet) {
    return (
      <SystemSettingAsideCardWrapper>
        <WorkspaceResourceSettingModal />
        <AsideFillCard
          title="워크스페이스 생성 및 기본 리소스 설정"
          titleExtraClassName="system-setting-aside__title-extra"
          titleExtra={
            <TitleExtraContainer>
              <GuideTooltip
                placement="left"
                maxWidth="500px"
                title={
                  <>
                    워크스페이스 생성 개수 설정은 사용자가 생성할 수 있는
                    <br />
                    워크스페이스의{" "}
                    <TooltipHighlightText>
                      최대 개수를 지정
                    </TooltipHighlightText>
                    하고, 기본 리소스 설정은
                    <br />
                    워크로드 실행을 위한{" "}
                    <TooltipHighlightText>
                      초기 GPU, CPU, Memory 할당
                    </TooltipHighlightText>
                    을 지정합니다.
                  </>
                }
              />
              <Button
                icon="Edit02"
                width={26}
                height={26}
                iconSize={20}
                onClick={handleEditWorkspaceCount}
              />
            </TitleExtraContainer>
          }
        >
          <ContentContainer>
            <DataErrorState />
          </ContentContainer>
        </AsideFillCard>
      </SystemSettingAsideCardWrapper>
    );
  }

  // 값 추출 및 변환
  const workspaceLimit = policySet?.workspaceLimitCount;

  // 전체 리소스 값 추출 (클러스터 전체)
  const totalGpuCount = clusterTotalResources?.gpu.clusterCapacityCount;
  const totalCpuCore = clusterTotalResources?.cpu.clusterCapacityCores;
  const totalMemoryByte = clusterTotalResources?.memory.clusterCapacityBytes;

  // 전체 메모리 바이트 → GB 변환
  const totalMemoryGB = totalMemoryByte
    ? convertBytes(Number(totalMemoryByte), "GB").value
    : undefined;

  // 전체 MIG 프로필 (클러스터 전체)
  const totalMigProfiles =
    clusterMigProfiles?.migProfiles.map((mig) => ({
      profile: mig.profile,
      count: mig.maxCount,
    })) ?? [];
  const isMigSupported = totalMigProfiles.length > 0;

  // 기본 리소스 값 추출 (워크스페이스 기본값)
  const defaultGpuCount = policySet?.resource.gpu?.detail?.normal?.requestCount;
  const defaultMpsCount = policySet?.resource.gpu?.detail?.mps?.requestCount;
  const defaultCpuCore = policySet?.resource.cpu.requestCore;
  const defaultMemoryByte = policySet?.resource.memory.requestByte;

  // 기본 메모리 바이트 → GB 변환
  const defaultMemoryGB = defaultMemoryByte
    ? convertBytes(defaultMemoryByte, "GB").value
    : undefined;

  // 기본 MIG 프로필
  const defaultMigProfiles =
    policySet?.resource.gpu?.detail?.mig?.map((mig) => ({
      profile: mig.profile,
      count: mig.requestCount,
    })) ?? [];

  // 리소스 정보 추출
  const gpuInfo = getResourceInfo("GPU");
  const mpsInfo = getResourceInfo("MPS");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");
  const migInfo = getResourceInfo("MIG");

  return (
    <SystemSettingAsideCardWrapper>
      <WorkspaceResourceSettingModal />
      <AsideFillCard
        title="워크스페이스 생성 및 기본 리소스 설정"
        titleExtraClassName="system-setting-aside__title-extra"
        titleExtra={
          <TitleExtraContainer>
            <GuideTooltip
              placement="left"
              maxWidth="500px"
              title={
                <>
                  워크스페이스 생성 개수 설정은 사용자가 생성할 수 있는
                  <br />
                  워크스페이스의{" "}
                  <TooltipHighlightText>최대 개수를 지정</TooltipHighlightText>
                  하고, 기본 리소스 설정은
                  <br />
                  워크로드 실행을 위한{" "}
                  <TooltipHighlightText>
                    초기 GPU, CPU, Memory 할당
                  </TooltipHighlightText>
                  을 지정합니다.
                </>
              }
            />
            <Button
              icon="Edit02"
              width={26}
              height={26}
              iconSize={20}
              onClick={handleEditWorkspaceCount}
            />
          </TitleExtraContainer>
        }
      >
        <ContentContainer>
          {/* 워크스페이스 생성 개수 */}
          <WorkspaceBox>
            <Typography.Text variant="body-2-2">
              워크스페이스 생성 개수
            </Typography.Text>
            <Typography.Text variant="body-2-4">
              {formatNumberWithUnit(workspaceLimit, "개", "-")}
            </Typography.Text>
          </WorkspaceBox>

          {/* 전체 / 기본 리소스 (단일 박스) */}
          <ResourceBox>
            {/* 전체 리소스 */}
            <ResourceSection>
              <ResourceBoxHeader>
                <Typography.Text variant="body-2-2">
                  전체 리소스
                </Typography.Text>
              </ResourceBoxHeader>

              {/* GPU, CPU, Memory 직접 렌더링 */}
              <ResourceLabelRow>
                {totalGpuCount !== undefined && (
                  <LabelContainer>
                    <Label
                      dotColor={gpuInfo.color}
                      textColor={gpuInfo.color}
                      size="large"
                      theme="light"
                    >
                      <Typography.Text variant="body-3-1">
                        {gpuInfo.text}
                      </Typography.Text>
                    </Label>
                    <Typography.Text variant="body-2-3">
                      {formatNumberWithUnit(totalGpuCount, gpuInfo.unit, "-")}
                    </Typography.Text>
                  </LabelContainer>
                )}

                <LabelContainer>
                  <Label
                    dotColor={cpuInfo.color}
                    textColor={cpuInfo.color}
                    size="large"
                    theme="light"
                  >
                    <Typography.Text variant="body-3-1">
                      {cpuInfo.text}
                    </Typography.Text>
                  </Label>
                  <Typography.Text variant="body-2-3">
                    {formatNumberWithUnit(totalCpuCore, cpuInfo.unit, "-")}
                  </Typography.Text>
                </LabelContainer>

                <LabelContainer>
                  <Label
                    dotColor={memInfo.color}
                    textColor={memInfo.color}
                    size="large"
                    theme="light"
                  >
                    <Typography.Text variant="body-3-1">
                      {memInfo.text}
                    </Typography.Text>
                  </Label>
                  <Typography.Text variant="body-2-3">
                    {formatNumberWithUnit(totalMemoryGB, memInfo.unit, "-")}
                  </Typography.Text>
                </LabelContainer>
              </ResourceLabelRow>

              {/* MIG 섹션 */}
              {isMigSupported ? (
                <MigSection>
                  <MigLabelRow>
                    <Label
                      dotColor={migInfo.color}
                      textColor={migInfo.color}
                      size="large"
                      theme="light"
                    >
                      <Typography.Text variant="body-3-1">
                        {migInfo.text}
                      </Typography.Text>
                    </Label>
                  </MigLabelRow>
                  <MigProfilesContainer>
                    {totalMigProfiles.map((mig, index) => (
                      <MigProfileItem key={`total-mig-${mig.profile}-${index}`}>
                        <MigProfile>{mig.profile}</MigProfile>
                        <MigCount>
                          {formatNumberWithUnit(mig.count, "개")}
                        </MigCount>
                      </MigProfileItem>
                    ))}
                  </MigProfilesContainer>
                </MigSection>
              ) : (
                <MigNotice>
                  <MigNoticeTitle>
                    해당 GPU는 MIG 분할 기능을 지원하지 않습니다.
                  </MigNoticeTitle>
                  <MigNoticeContent>
                    MIG 분할은 NVIDIA에서 해당 기능을 지원하는
                    <br />
                    GPU 모델에서만 적용할 수 있습니다.
                  </MigNoticeContent>
                </MigNotice>
              )}
            </ResourceSection>

            {/* 기본 리소스 */}
            <ResourceSection hasTopBorder>
              <ResourceBoxHeader>
                <Typography.Text variant="body-2-2">
                  기본 리소스
                </Typography.Text>
              </ResourceBoxHeader>

              {/* GPU, MPS, CPU, Memory 직접 렌더링 */}
              <ResourceLabelRow>
                {defaultGpuCount !== undefined && (
                  <LabelContainer>
                    <Label
                      dotColor={gpuInfo.color}
                      textColor={gpuInfo.color}
                      size="large"
                      theme="light"
                    >
                      <Typography.Text variant="body-3-1">
                        {gpuInfo.text}
                      </Typography.Text>
                    </Label>
                    <Typography.Text variant="body-2-3">
                      {formatNumberWithUnit(defaultGpuCount, gpuInfo.unit, "-")}
                    </Typography.Text>
                  </LabelContainer>
                )}

                {defaultMpsCount !== undefined && (
                  <LabelContainer>
                    <Label
                      dotColor={mpsInfo.color}
                      textColor={mpsInfo.color}
                      size="large"
                      theme="light"
                    >
                      <Typography.Text variant="body-3-1">
                        {mpsInfo.text}
                      </Typography.Text>
                    </Label>
                    <Typography.Text variant="body-2-3">
                      {formatNumberWithUnit(defaultMpsCount, mpsInfo.unit, "-")}
                    </Typography.Text>
                  </LabelContainer>
                )}

                <LabelContainer>
                  <Label
                    dotColor={cpuInfo.color}
                    textColor={cpuInfo.color}
                    size="large"
                    theme="light"
                  >
                    <Typography.Text variant="body-3-1">
                      {cpuInfo.text}
                    </Typography.Text>
                  </Label>
                  <Typography.Text variant="body-2-3">
                    {formatNumberWithUnit(defaultCpuCore, cpuInfo.unit, "-")}
                  </Typography.Text>
                </LabelContainer>

                <LabelContainer>
                  <Label
                    dotColor={memInfo.color}
                    textColor={memInfo.color}
                    size="large"
                    theme="light"
                  >
                    <Typography.Text variant="body-3-1">
                      {memInfo.text}
                    </Typography.Text>
                  </Label>
                  <Typography.Text variant="body-2-3">
                    {formatNumberWithUnit(defaultMemoryGB, memInfo.unit, "-")}
                  </Typography.Text>
                </LabelContainer>
              </ResourceLabelRow>

              {/* MIG 섹션 */}
              {defaultMigProfiles.length > 0 ? (
                <MigSection>
                  <MigLabelRow>
                    <Label
                      dotColor={migInfo.color}
                      textColor={migInfo.color}
                      size="large"
                      theme="light"
                    >
                      <Typography.Text variant="body-3-1">
                        {migInfo.text}
                      </Typography.Text>
                    </Label>
                  </MigLabelRow>
                  <MigProfilesContainer>
                    {defaultMigProfiles.map((mig, index) => (
                      <MigProfileItem
                        key={`default-mig-${mig.profile}-${index}`}
                      >
                        <MigProfile>{mig.profile}</MigProfile>
                        <MigCount>
                          {formatNumberWithUnit(mig.count, "개")}
                        </MigCount>
                      </MigProfileItem>
                    ))}
                  </MigProfilesContainer>
                </MigSection>
              ) : isMigSupported ? (
                <MigNotice>
                  <MigNoticeTitle>
                    기본 MIG 리소스가 설정되지 않았습니다.
                  </MigNoticeTitle>
                  <MigNoticeContent>
                    워크스페이스 생성 시 MIG 리소스가 할당되지 않습니다.
                  </MigNoticeContent>
                </MigNotice>
              ) : (
                <MigNotice>
                  <MigNoticeTitle>
                    해당 GPU는 MIG 분할 기능을 지원하지 않습니다.
                  </MigNoticeTitle>
                  <MigNoticeContent>
                    MIG 분할은 NVIDIA에서 해당 기능을 지원하는
                    <br />
                    GPU 모델에서만 적용할 수 있습니다.
                  </MigNoticeContent>
                </MigNotice>
              )}
            </ResourceSection>
          </ResourceBox>
        </ContentContainer>
      </AsideFillCard>
    </SystemSettingAsideCardWrapper>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const SystemSettingAsideCardWrapper = styled.div`
  width: 100%;

  /* AsideFillCard 내부 TitleExtra 영역 확장 - 구조가 아닌 명시적 클래스 기반 */
  .system-setting-aside__title-extra {
    display: flex;
    flex: 1 1 auto;
  }
`;

const TitleExtraContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ResourceBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  background: var(--color-gray-16);
  border: 1px solid var(--color-gray-10);
  border-radius: 4px;
`;

// 워크스페이스 생성 개수 박스
const WorkspaceBox = styled(ResourceBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 16px;
`;

// 리소스 섹션 스타일
const ResourceSection = styled.div<{ hasTopBorder?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;

  ${({ hasTopBorder }) =>
    hasTopBorder &&
    `
      border-top: 1px solid #e1e4e7;
    `}
`;

const ResourceBoxHeader = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  border-bottom: 1px solid #e1e4e7;
  margin: -16px -16px 16px;
  padding: 0 16px;
`;

const ResourceLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 10px;
`;

// MIG 섹션 스타일
const MigSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--color-gray-10);
`;

const MigLabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MigProfilesContainer = styled.div`
width: 100%;
display: grid;
grid-template-columns: repeat(2, 1fr);
  row-gap: 4px;
  column-gap: 8px;
  max-height: 54px;
  overflow-y: auto;
`;

const MigProfileItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:nth-child(2n-1) {
    border-right: 1px solid var(--color-gray-08);
  }
`;

const MigProfile = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #000000;
`;

const MigCount = styled.span`
  font-weight: 400;
  font-size: 12px;
  color: #070913;
`;

const MigNotice = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6px ;
  border-top: 1px solid var(--color-gray-10);
  padding-top: 22px;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MigNoticeTitle = styled.div`
  font-weight: 600;
  font-size: 12px;
`;

const MigNoticeContent = styled.div`
  font-weight: 400;
  font-size: 10px;
  color: var(--color-gray-04);
  text-align: center;
`;
