"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Switch } from "xiilab-ui";

import { NotificationConfirmModal } from "@/domain/notification/components/detail/notification-confirm-modal";
import {
  NOTIFICATION_CHANNEL,
  type NotificationChannelState,
  type NotificationConfirmState,
} from "@/domain/notification/type/notification-setting.type";

export interface NotificationSettingCardProps extends NotificationChannelState {
  label: string;
  onSystemChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
}

export function NotificationSettingCard({
  label,
  systemChecked,
  emailChecked,
  onSystemChange,
  onEmailChange,
}: NotificationSettingCardProps) {
  const [confirmState, setConfirmState] =
    useState<NotificationConfirmState>(null);

  const handleSystemClick = (checked: boolean) => {
    setConfirmState({ channel: NOTIFICATION_CHANNEL.SYSTEM, value: checked });
  };

  const handleEmailClick = (checked: boolean) => {
    setConfirmState({ channel: NOTIFICATION_CHANNEL.EMAIL, value: checked });
  };

  const handleConfirm = () => {
    if (confirmState === null) return;

    if (confirmState.channel === NOTIFICATION_CHANNEL.SYSTEM) {
      onSystemChange(confirmState.value);
    } else {
      onEmailChange(confirmState.value);
    }
    setConfirmState(null);
  };

  const handleCancel = () => {
    setConfirmState(null);
  };

  return (
    <>
      <CardContainer>
        <CardLabel>{label}</CardLabel>
        <SwitchList>
          <SwitchItem>
            <IconTextGroup>
              <Icon name="SystemFilled" size={20} color="#404040" />
              <SwitchLabel>System</SwitchLabel>
            </IconTextGroup>
            <Switch checked={systemChecked} onChange={handleSystemClick} />
          </SwitchItem>
          <SwitchItem>
            <IconTextGroup>
              <Icon name="MailFilled" size={20} color="#404040" />
              <SwitchLabel>Email</SwitchLabel>
            </IconTextGroup>
            <Switch checked={emailChecked} onChange={handleEmailClick} />
          </SwitchItem>
        </SwitchList>
      </CardContainer>

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

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #fff;
`;

const CardLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #000;
  margin-bottom: 12px;
`;

const SwitchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SwitchItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  background-color: #fafafa;
  border-radius: 2px;
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
