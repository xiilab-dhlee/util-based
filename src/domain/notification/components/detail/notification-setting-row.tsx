"use client";

import { useState } from "react";
import styled from "styled-components";
import { Icon, Switch } from "xiilab-ui";

import { NotificationConfirmModal } from "@/domain/notification/components/detail/notification-confirm-modal";

export interface NotificationSettingRowProps {
  label: string;
  systemChecked: boolean;
  emailChecked: boolean;
  onSystemChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
}

type ConfirmType = "system" | "email" | null;

export function NotificationSettingRow({
  label,
  systemChecked,
  emailChecked,
  onSystemChange,
  onEmailChange,
}: NotificationSettingRowProps) {
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
        open={confirmType !== null}
        title={label}
        pendingValue={pendingValue}
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
