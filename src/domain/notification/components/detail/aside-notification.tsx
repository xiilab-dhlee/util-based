"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";

import { useGetAdminNotificationSets } from "@/api/generated/admin-account-notification/admin-account-notification";
import type {
  AdminNotificationSetResponse,
  NotificationSetUpdateRequest,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AdminNotificationSettingItem } from "@/domain/notification/components/detail/admin-notification-setting-item";
import { NotificationDetailMain } from "@/domain/notification/components/detail/notification-detail-main";
import { NotificationSettingSection } from "@/domain/notification/components/detail/notification-setting-section";
import { useUpdateAdminNotificationSetAction } from "@/domain/notification/hooks/notification-actions";
import {
  ADMIN_NOTIFICATION_SECTIONS,
  type NotificationChannel,
} from "@/shared/constants/notification";
import { getSessionAccountId } from "@/shared/utils/auth.util";
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

  return <NotificationSettingsPanel />;
}

function NotificationSettingsPanel() {
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";

  const { data, isLoading } = useGetAdminNotificationSets(accountId, {
    query: { enabled: Boolean(accountId) },
  });
  const { mutate } = useUpdateAdminNotificationSetAction(accountId);

  const findByName = (name: string) =>
    (data ?? []).find((s) => s.notificationSetName === name);

  const handleToggle = (
    setting: AdminNotificationSetResponse,
    channel: NotificationChannel,
    checked: boolean,
  ) => {
    if (!accountId) return;

    const requestData: NotificationSetUpdateRequest = {
      isSystemNotificationEnabled:
        channel === "SYSTEM" ? checked : setting.isSystemNotificationEnabled,
      isEmailNotificationEnabled:
        channel === "EMAIL" ? checked : setting.isEmailNotificationEnabled,
    };

    mutate({
      accountId,
      notificationSetId: setting.notificationSetId,
      data: requestData,
    });
  };

  return (
    <AsideDetailContainer>
      <AsideListArticleHeader>
        <AsideListArticleTitle>알림 설정</AsideListArticleTitle>
      </AsideListArticleHeader>

      <SectionsWrapper>
        {ADMIN_NOTIFICATION_SECTIONS.map(({ category, label, items }) => (
          <NotificationSettingSection key={category} title={label}>
            {items.map((name) => {
              const setting = findByName(name);
              return (
                <AdminNotificationSettingItem
                  key={name}
                  name={name}
                  setting={setting}
                  disabled={isLoading || !setting}
                  onToggle={handleToggle}
                />
              );
            })}
          </NotificationSettingSection>
        ))}
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
