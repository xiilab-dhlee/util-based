"use client";

import styled from "styled-components";
import { Button, Label, Typography } from "xiilab-ui";

import { WorkspaceResourceSettingModal } from "@/domain/system-setting/components/workspace-resource-setting-modal";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { SYSTEM_SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { TooltipHighlightText } from "@/styles/mixins/text";
import type { CoreResourceType } from "@/shared/types/core.interface";

/**
 * 시스템 설정 페이지 사이드바
 * AsideFillCard를 사용한 워크스페이스 생성 및 기본 리소스 설정 영역
 */
export function SystemSettingAside() {
  const publish = usePublish();

  const handleEditWorkspaceCount = () => {
    publish(SYSTEM_SETTING_EVENTS.openWorkspaceResourceSettingModal, {});
  };

  // MIG 지원 여부 (실제로는 API에서 가져와야 함)
  const isMigSupported = false; // TODO: API에서 가져오기

  // TODO: API에서 가져오기 - 임시 데이터
  const tempTotalResources = [
    { type: "GPU" as const, value: 15 },
    { type: "MPS" as const, value: 4 },
    { type: "CPU" as const, value: 4 },
    { type: "MEM" as const, value: 12 },
  ];

  const tempDefaultResources = [
    { type: "GPU" as const, value: 15 },
    { type: "MPS" as const, value: 4 },
    { type: "CPU" as const, value: 4 },
    { type: "MEM" as const, value: 12 },
  ];

  const tempMigProfiles = [
    { profile: "1g.12gb", count: 2 },
    { profile: "1g.12gb", count: 2 },
    { profile: "1g.12gb", count: 2 },
    { profile: "10g.12gb", count: 2 },
    { profile: "10g.12gb", count: 2 },
  ];

  // Helper 함수: 리소스 라벨 렌더링
  const renderResourceLabels = (
    resources: Array<{ type: CoreResourceType; value: number }>,
    keyPrefix: string
  ) => {
    return (
      <ResourceLabelRow>
        {resources.map((resource) => {
          const info = getResourceInfo(resource.type);
          return (
            <LabelContainer key={`${keyPrefix}-${resource.type}`}>
              <Label
                dotColor={info.color}
                textColor={info.color}
                size="large"
                theme="light"
              >
                <Typography.Text variant="body-3-1" as="span">
                  {info.text}
                </Typography.Text>
              </Label>
              <Typography.Text variant="body-2-3" as="span">
                {resource.value}
                {info.unit}
              </Typography.Text>
            </LabelContainer>
          );
        })}
      </ResourceLabelRow>
    );
  };

  // Helper 함수: MIG 섹션 렌더링
  const renderMigSection = (
    isMigSupported: boolean,
    migProfiles: Array<{ profile: string; count: number }>,
    keyPrefix: string
  ) => {
    return (
      <>
        {isMigSupported ? (
          <MigSection>
            <MigLabelRow>
              <LabelContainer>
                <Label
                  dotColor={getResourceInfo("MIG").color}
                  textColor={getResourceInfo("MIG").color}
                  size="large"
                  theme="light"
                >
                  <Typography.Text variant="body-3-1" as="span">
                    {getResourceInfo("MIG").text}
                  </Typography.Text>
                </Label>
              </LabelContainer>
            </MigLabelRow>
            <MigProfilesContainer>
              {migProfiles.map((mig, index) => (
                <MigProfileItem key={`${keyPrefix}-mig-${mig.profile}-${index}`}>
                  <MigProfile>{mig.profile}</MigProfile>
                  <MigCount>{mig.count}개</MigCount>
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
      </>
    );
  };

  return (
    <SystemSettingAsideCardWrapper>
      <WorkspaceResourceSettingModal />
      <AsideFillCard
        title="워크스페이스 생성 및 기본 리소스 설정"
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
            <Typography.Text variant="body-2-2" as="span">
              워크스페이스 생성 개수
            </Typography.Text>
            <Typography.Text variant="body-2-4" as="span">
              12개
            </Typography.Text>
          </WorkspaceBox>

          {/* 전체 / 기본 리소스 (단일 박스) */}
          <ResourceBox>
            {/* 전체 리소스 */}
            <ResourceSection>
              <ResourceBoxHeader>
                <Typography.Text variant="body-2-2" as="span">
                  전체 리소스
                </Typography.Text>
              </ResourceBoxHeader>
              {renderResourceLabels(tempTotalResources, "total")}
              {renderMigSection(isMigSupported, tempMigProfiles, "total")}
            </ResourceSection>

            {/* 기본 리소스 */}
            <ResourceSection hasTopBorder>
              <ResourceBoxHeader>
                <Typography.Text variant="body-2-2" as="span">
                  기본 리소스
                </Typography.Text>
              </ResourceBoxHeader>
              {renderResourceLabels(tempDefaultResources, "default")}
              {renderMigSection(isMigSupported, tempMigProfiles, "default")}
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

  /* AsideFillCard 내부 Header의 TitleExtra(span)를 이 카드 안에서만 확장 */
  > div > div:first-child > span:last-child {
    display: flex;
    flex: 1 1 auto;
  }
`;

const TitleExtraContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  justify-content: space-between;
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
  margin-left: 16px;
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
