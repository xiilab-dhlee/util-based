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

export interface NotificationSettingRowProps extends NotificationChannelState {
  label: string;
  onSystemChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
}

export function NotificationSettingRow({
  label,
  systemChecked,
  emailChecked,
  onSystemChange,
  onEmailChange,
}: NotificationSettingRowProps) {
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
      <RowContainer>
        <RowLabel>{label}</RowLabel>
        <SwitchContainer>
          <SwitchGroup>
            <IconTextGroup>
              <Icon name="SystemFilled" size={20} color="#404040" />
              <SwitchLabel>System</SwitchLabel>
            </IconTextGroup>
            <Switch checked={systemChecked} onChange={handleSystemClick} />
          </SwitchGroup>
          <Divider />
          <SwitchGroup>
            <IconTextGroup>
              <Icon name="MailFilled" size={20} color="#404040" />
              <SwitchLabel>Email</SwitchLabel>
            </IconTextGroup>
            <Switch checked={emailChecked} onChange={handleEmailClick} />
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
