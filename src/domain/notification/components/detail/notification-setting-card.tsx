"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Switch } from "xiilab-ui";

import { NotificationConfirmModal } from "@/domain/notification/components/detail/notification-confirm-modal";

export interface NotificationSettingCardProps {
  label: string;
  systemChecked: boolean;
  emailChecked: boolean;
  onSystemChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
}

type ConfirmType = "system" | "email" | null;

export function NotificationSettingCard({
  label,
  systemChecked,
  emailChecked,
  onSystemChange,
  onEmailChange,
}: NotificationSettingCardProps) {
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [pendingValue, setPendingValue] = useState<boolean>(false);

  const handleSystemClick = (checked: boolean) => {
    setConfirmType("system");
    setPendingValue(checked);
  };

  const handleEmailClick = (checked: boolean) => {
    setConfirmType("email");
    setPendingValue(checked);
  };

  const handleConfirm = () => {
    if (confirmType === "system") {
      onSystemChange(pendingValue);
    } else if (confirmType === "email") {
      onEmailChange(pendingValue);
    }
    setConfirmType(null);
  };

  const handleCancel = () => {
    setConfirmType(null);
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
        open={confirmType !== null}
        title={label}
        pendingValue={pendingValue}
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
