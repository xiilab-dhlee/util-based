"use client";

import Image from "next/image";
import styled from "styled-components";
import { Label, Switch, Typography } from "xiilab-ui";

import { useGetApprovalStatusSummary } from "@/api/generated/admin-image-tag-usage-request/admin-image-tag-usage-request";
import { ImageTagUsageRequestResponseApprovalStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  useGetAstragoOnlyPolicy,
  useGetLevelPolicy,
  useGetScanPolicy,
} from "@/api/generated/vulnerability-policy-admin/vulnerability-policy-admin";
import { ExternalImagePolicyConfirmModal } from "@/domain/registry/components/entry/external-image-policy-confirm-modal";
import { PrivateScanPolicyConfirmModal } from "@/domain/registry/components/entry/private-scan-policy-confirm-modal";
import { PublicScanPolicyConfirmModal } from "@/domain/registry/components/entry/public-scan-policy-confirm-modal";
import { RequestImageStatusCard } from "@/domain/registry/components/entry/request-image-status-card";
import { SecurityLevelSettingButton } from "@/domain/registry/components/entry/security-level-setting-button";
import { SecuritySettingCard } from "@/domain/registry/components/entry/security-setting-card";
import { REGISTRY_QUICK_MENUS } from "@/domain/registry/constants/registry.constant";
import { UserMonitoringQuickMenu } from "@/domain/user-monitoring/components/user-monitoring-quick-menu";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { CoreSecurityLevel } from "@/shared/types/core.interface";
import { getVulnerabilityLevelInfo } from "@/shared/utils/vulnerability.util";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

export function RegistryMainSection() {
  const publish = usePublish();

  // 이미지 사용 요청 상태 조회
  const { data: approvalStatusSummary, isLoading } =
    useGetApprovalStatusSummary();

  // 보안 정책 조회
  const { data: scanPolicy, isLoading: isScanPolicyLoading } =
    useGetScanPolicy();
  const { data: astragoOnlyPolicy, isLoading: isAstragoOnlyPolicyLoading } =
    useGetAstragoOnlyPolicy();
  const { data: levelPolicy } = useGetLevelPolicy();

  // 개인 레지스트리 스캔 정책 변경 핸들러
  const handlePrivateScanPolicyChange = (hasEnabled: boolean) => {
    publish(REGISTRY_EVENTS.openPrivateScanPolicyConfirmModal, { hasEnabled });
  };

  // 공유 레지스트리 스캔 정책 변경 핸들러
  const handlePublicScanPolicyChange = (hasEnabled: boolean) => {
    publish(REGISTRY_EVENTS.openPublicScanPolicyConfirmModal, { hasEnabled });
  };

  // 외부 업로드 이미지 사용 허용 정책 변경 핸들러
  // checked = true → 외부 이미지 허용 (astragoOnly = false)
  // checked = false → 외부 이미지 제한 (astragoOnly = true)
  const handleExternalImagePolicyChange = (allowExternalImage: boolean) => {
    publish(REGISTRY_EVENTS.openExternalImagePolicyConfirmModal, {
      allowExternalImage,
    });
  };

  return (
    <Container>
      <Left>
        <Thumbnail>
          <Image
            src="/images/registry-quick-menu-guide.png"
            alt="Quick Menu Guide"
            layout="fill"
          />
        </Thumbnail>
        <QuickMenus>
          {REGISTRY_QUICK_MENUS.map((menu) => (
            <UserMonitoringQuickMenu key={menu.title} height={120} {...menu} />
          ))}
        </QuickMenus>
      </Left>
      <Right>
        <SectionTitle className="no-line">레지스트리 현황 및 관리</SectionTitle>
        <RightBody>
          <RequestImage>
            <Typography.Text variant="title-2" color="#fff">
              이미지 사용 승인 여부
            </Typography.Text>
            <RequestImageBody>
              <RequestImageStatusCard
                status={ImageTagUsageRequestResponseApprovalStatus.APPROVED}
                count={approvalStatusSummary?.approved ?? 0}
                isLoading={isLoading}
              />
              <RequestImageStatusCard
                status={
                  ImageTagUsageRequestResponseApprovalStatus.APPROVAL_WAITING
                }
                count={approvalStatusSummary?.approvalWaiting ?? 0}
                isLoading={isLoading}
              />
              <RequestImageStatusCard
                status={ImageTagUsageRequestResponseApprovalStatus.REJECTED}
                count={approvalStatusSummary?.rejected ?? 0}
                isLoading={isLoading}
              />
            </RequestImageBody>
          </RequestImage>
          <SecuritySetting>
            <Typography.Text variant="title-2" color="#fff">
              레지스트리 보안 정책 설정
            </Typography.Text>
            <SecuritySettingBody>
              <SecuritySettingCard
                title={
                  <>
                    개인 레지스트리
                    <br />
                    이미지 보안 검사
                  </>
                }
                description="개인 레지스트리에 업로드한 컨테이너 이미지의 보안 검사 수행 여부 설정"
                action={
                  <Switch
                    darkMode
                    checked={scanPolicy?.isPrivateScanEnabled}
                    onChange={handlePrivateScanPolicyChange}
                    disabled={isScanPolicyLoading}
                  />
                }
              />
              <SecuritySettingCard
                title={
                  <>
                    공유 레지스트리
                    <br />
                    이미지 보안 검사
                  </>
                }
                description="공유 레지스트리에 업로드한 컨테이너 이미지의 보안 검사 수행 여부 설정"
                action={
                  <Switch
                    darkMode
                    checked={scanPolicy?.isPublicScanEnabled}
                    onChange={handlePublicScanPolicyChange}
                    disabled={isScanPolicyLoading}
                  />
                }
              />
              <SecuritySettingCard
                title={
                  <>
                    외부 업로드 이미지
                    <br />
                    사용 허용
                  </>
                }
                description="AstraGo를 통해 등록되지 않은 외부 레지스트리 이미지의 사용 가능 여부를 설정"
                action={
                  <Switch
                    darkMode
                    checked={!astragoOnlyPolicy?.isEnabled}
                    onChange={handleExternalImagePolicyChange}
                    disabled={isAstragoOnlyPolicyLoading}
                  />
                }
              />
              <SecuritySettingCard
                title={
                  <>
                    보안 레벨 설정
                    <br />
                    <Label
                      variant={
                        levelPolicy?.isRestrictionEnabled ? "blue" : "black"
                      }
                    >
                      {levelPolicy?.isRestrictionEnabled ? "사용중" : "미사용"}
                    </Label>
                  </>
                }
                description={
                  levelPolicy?.isRestrictionEnabled
                    ? `${getVulnerabilityLevelInfo(levelPolicy.severity as CoreSecurityLevel).text} 이상의 취약점 ${levelPolicy.severityCount}개 이상 발견 시, 승인 필요`
                    : "보안 레벨 기능이 비활성화되어 있습니다"
                }
                action={<SecurityLevelSettingButton />}
              />
            </SecuritySettingBody>
          </SecuritySetting>
        </RightBody>
      </Right>
      {/* 개인 레지스트리 보안 스캔 정책 변경 확인 모달 */}
      <PrivateScanPolicyConfirmModal />
      {/* 공유 레지스트리 보안 스캔 정책 변경 확인 모달 */}
      <PublicScanPolicyConfirmModal />
      {/* 외부 업로드 이미지 사용 허용 정책 변경 확인 모달 */}
      <ExternalImagePolicyConfirmModal />
    </Container>
  );
}

/**
 * 관리자 대시보드 섹션의 메인 컨테이너
 *
 * 3단 레이아웃을 구성하는 메인 컨테이너로, 어두운 배경과 그림자 효과를 가집니다.
 * flexbox를 사용하여 왼쪽, 중앙, 오른쪽 영역을 균등하게 배치합니다.
 */
const Container = styled.section`
  border-radius: 10px;
  height: var(--user-monitoring-main-section-height);
  padding: 23px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  margin-bottom: var(--user-monitoring-main-section-margin-bottom);
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);

  --primary-border-color: #3a4561;
  --secondary-border-color: #2a3041;
`;

/**
 * 왼쪽 영역 스타일
 *
 * 빠른 메뉴와 가이드 이미지를 포함하는 영역입니다.
 * 고정 너비(634px)를 가지며 세로 방향으로 배치됩니다.
 */
const Left = styled.div`
  width: 692px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;

/**
 * 중앙 영역 스타일
 *
 * 클러스터 자원 정보 차트들을 표시하는 영역입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지하며 세로 방향으로 배치됩니다.
 */
const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/**
 * 콘텐츠 헤더 스타일
 *
 * 각 섹션의 제목을 표시하는 헤더 영역입니다.
 * 좌측 패딩을 적용하여 시각적 정렬을 맞춥니다.
 */
const SectionTitle = styled(UserMonitoringSectionTitle)`
  margin-bottom: 20px;
`;

/**
 * 썸네일 이미지 컨테이너
 *
 * 빠른 메뉴 가이드 이미지를 표시하는 컨테이너입니다.
 * 고정 높이(184px)를 가지며 이미지가 컨테이너를 완전히 채웁니다.
 */
const Thumbnail = styled.div`
  width: 100%;
  height: 260px;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

/**
 * 빠른 메뉴 그리드 컨테이너
 *
 * 4열 그리드로 빠른 메뉴들을 배치하는 컨테이너입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지합니다.
 */
const QuickMenus = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

/**
 * 중앙 영역 본문 컨테이너
 *
 * 클러스터 자원 정보 차트들을 2열 그리드로 배치하는 컨테이너입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지합니다.
 */
const RightBody = styled.div`
  flex: 1;
  background-color: #171b26;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

const RequestImage = styled.div`
  width: 236px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-right: 20px;
`;

const RequestImageBody = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 16px;
  border-right: 1px solid #2a3041;
  margin-top: 20px;
`;

const SecuritySetting = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SecuritySettingBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  height: 100%;
`;
