"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { NotificationDetailMain } from "@/domain/notification/components/detail/notification-detail-main";
import { NotificationSettingSection } from "@/domain/notification/components/detail/notification-setting-section";
import { LicenseExpireAlertSetting } from "@/domain/notification/components/detail/settings/license-expire-alert-setting";
import { MemberApprovalAlertSetting } from "@/domain/notification/components/detail/settings/member-approval-alert-setting";
import { MemberSignupAlertSetting } from "@/domain/notification/components/detail/settings/member-signup-alert-setting";
import { MigApplyAlertSetting } from "@/domain/notification/components/detail/settings/mig-apply-alert-setting";
import { MigFailAlertSetting } from "@/domain/notification/components/detail/settings/mig-fail-alert-setting";
import { NodeFailAlertSetting } from "@/domain/notification/components/detail/settings/node-fail-alert-setting";
import { ResourceRecoveryAlertSetting } from "@/domain/notification/components/detail/settings/resource-recovery-alert-setting";
import { ResourceWarningAlertSetting } from "@/domain/notification/components/detail/settings/resource-warning-alert-setting";
import { VulnerableImageAlertSetting } from "@/domain/notification/components/detail/settings/vulnerable-image-alert-setting";
import { WorkspaceCreateAlertSetting } from "@/domain/notification/components/detail/settings/workspace-create-alert-setting";
import { WorkspaceResourceExceedAlertSetting } from "@/domain/notification/components/detail/settings/workspace-resource-exceed-alert-setting";
import { WorkspaceResourceRequestAlertSetting } from "@/domain/notification/components/detail/settings/workspace-resource-request-alert-setting";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import {
  AsideListArticleHeader,
  AsideListArticleTitle,
} from "@/styles/layers/aside-list-layers.styled";

export function AsideNotification() {
  const params = useParams<{ id?: string }>();

  // URL에 id가 있는 경우 상세 정보 표시
  if (params.id) {
    return <NotificationDetailMain />;
  }

  // 알림이 선택되지 않은 경우 알림 설정 표시
  return (
    <AsideDetailContainer>
      <AsideListArticleHeader>
        <AsideListArticleTitle>알림 설정</AsideListArticleTitle>
      </AsideListArticleHeader>

      <SectionsWrapper>
        {/* 라이선스 (상단) */}
        <NotificationSettingSection title="라이선스">
          <LicenseExpireAlertSetting />
        </NotificationSettingSection>

        {/* 회원 */}
        <NotificationSettingSection title="회원">
          <MemberSignupAlertSetting />
          <MemberApprovalAlertSetting />
        </NotificationSettingSection>

        {/* 보안 */}
        <NotificationSettingSection title="보안">
          <VulnerableImageAlertSetting />
        </NotificationSettingSection>

        {/* 노드 */}
        <NotificationSettingSection title="노드" grid>
          <NodeFailAlertSetting />
          <MigApplyAlertSetting />
          <MigFailAlertSetting />
        </NotificationSettingSection>

        {/* 워크스페이스 */}
        <NotificationSettingSection title="워크스페이스" grid>
          <WorkspaceCreateAlertSetting />
          <WorkspaceResourceExceedAlertSetting />
          <WorkspaceResourceRequestAlertSetting />
        </NotificationSettingSection>

        {/* 워크로드 */}
        <NotificationSettingSection title="워크로드">
          <ResourceWarningAlertSetting />
          <ResourceRecoveryAlertSetting />
        </NotificationSettingSection>
      </SectionsWrapper>
    </AsideDetailContainer>
  );
}

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
`;
