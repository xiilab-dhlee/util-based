"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Switch } from "xiilab-ui";

import type { AdminNotificationSetResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NotificationConfirmModal } from "@/domain/notification/components/detail/notification-confirm-modal";
import { getAdminNotificationSetLabel } from "@/domain/notification/constants/notification.constant";
import type { NotificationChannel } from "@/domain/notification/hooks/use-admin-notification-settings";

interface AdminNotificationSettingItemProps {
  /** 알림 설정명 (API 스펙 기반) */
  name: string;
  /** API에서 가져온 설정 데이터 (없으면 기본값 사용) */
  setting?: AdminNotificationSetResponse;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 토글 변경 핸들러 */
  onToggle: (
    notificationSet: AdminNotificationSetResponse,
    channel: NotificationChannel,
    checked: boolean,
  ) => void;
}

interface ConfirmState {
  channel: NotificationChannel;
  value: boolean;
}

export function AdminNotificationSettingItem({
  name,
  setting,
  disabled = false,
  onToggle,
}: AdminNotificationSettingItemProps) {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const label = getAdminNotificationSetLabel(name);
  const systemChecked = setting?.isSystemNotificationEnabled ?? false;
  const emailChecked = setting?.isEmailNotificationEnabled ?? false;

  const handleSystemClick = (checked: boolean) => {
    if (disabled || !setting) return;
    setConfirmState({ channel: "SYSTEM", value: checked });
  };

  const handleEmailClick = (checked: boolean) => {
    if (disabled || !setting) return;
    setConfirmState({ channel: "EMAIL", value: checked });
  };

  const handleConfirm = () => {
    if (!confirmState || !setting) return;
    onToggle(setting, confirmState.channel, confirmState.value);
    setConfirmState(null);
  };

  const handleCancel = () => {
    setConfirmState(null);
  };

  return (
    <>
      <RowContainer>
        <RowLabel>{label}</RowLabel>
        <SwitchContainer>
          <SwitchGroup>
            <IconTextGroup>
              <Icon name="SystemFilled" size={20} color="#404040" />
              <SwitchLabel>System</SwitchLabel>
            </IconTextGroup>
            <Switch
              checked={systemChecked}
              onChange={handleSystemClick}
              disabled={disabled}
            />
          </SwitchGroup>
          <Divider />
          <SwitchGroup>
            <IconTextGroup>
              <Icon name="MailFilled" size={20} color="#404040" />
              <SwitchLabel>Email</SwitchLabel>
            </IconTextGroup>
            <Switch
              checked={emailChecked}
              onChange={handleEmailClick}
              disabled={disabled}
            />
          </SwitchGroup>
        </SwitchContainer>
      </RowContainer>

      <NotificationConfirmModal
        open={confirmState !== null}
        title={label}
        pendingValue={confirmState?.value ?? false}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}

const RowContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #fff;
  padding: 10px;
`;

const RowLabel = styled.span`
  flex: 1;
  font-weight: 500;
  font-size: 12px;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 8px;
  background-color: #fafafa;
  border-radius: 2px;
`;

const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 154px;
`;

const IconTextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const SwitchLabel = styled.span`
  font-weight: 400;
  font-size: 11px;
  color: #333;
`;

const Divider = styled.div`
  width: 1px;
  height: 22px;
  background-color: #e9ebee;
  margin: 0 16px;
`;
