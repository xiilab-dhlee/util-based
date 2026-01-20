import styled from "styled-components";
import { Icon, Switch } from "xiilab-ui";

interface NotificationSettingSwitchProps {
  isSystemEnabled: boolean;
  isEmailEnabled: boolean;
  onSystemChange: (checked: boolean) => void;
  onEmailChange: (checked: boolean) => void;
  disabled: boolean;
  variant: "workspace" | "workload";
}

export function NotificationSettingSwitch({
  isSystemEnabled,
  isEmailEnabled,
  onSystemChange,
  onEmailChange,
  disabled,
  variant,
}: NotificationSettingSwitchProps) {
  if (variant === "workspace") {
    return (
      <WorkspaceSwitchBox>
        <SwitchGroup>
          <IconTextGroup>
            <Icon name="SystemFilled" size={16} />
            <span>System</span>
          </IconTextGroup>
          <Switch
            checked={isSystemEnabled}
            onChange={onSystemChange}
            disabled={disabled}
          />
        </SwitchGroup>
        <div className="divider" />
        <SwitchGroup>
          <IconTextGroup>
            <Icon name="MailFilled" size={16} />
            <span>Email</span>
          </IconTextGroup>
          <Switch
            checked={isEmailEnabled}
            onChange={onEmailChange}
            disabled={disabled}
          />
        </SwitchGroup>
      </WorkspaceSwitchBox>
    );
  }

  return (
    <SwitchBox>
      <SwitchItem>
        <IconTextGroup>
          <Icon name="SystemFilled" size={16} />
          <span>System</span>
        </IconTextGroup>
        <Switch
          checked={isSystemEnabled}
          onChange={onSystemChange}
          disabled={disabled}
        />
      </SwitchItem>
      <SwitchItem>
        <IconTextGroup>
          <Icon name="MailFilled" size={16} />
          <span>Email</span>
        </IconTextGroup>
        <Switch
          checked={isEmailEnabled}
          onChange={onEmailChange}
          disabled={disabled}
        />
      </SwitchItem>
    </SwitchBox>
  );
}

const SwitchBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: auto;
`;

const WorkspaceSwitchBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px;
  background-color: #fafafa;
  border-radius: 4px;
  flex-shrink: 0;

  .divider {
    width: 1px;
    height: 24px;
    background-color: #e0e0e0;
    margin: 0 20px;
  }
`;

const SwitchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 27px;
  font-size: 11px;
  color: #595959;
  font-weight: 400;
`;

const SwitchItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #595959;
  font-weight: 400;
  width: 156px;
  height: 30px;
  padding: 0 8px;
  background-color: #fafafa;
  border-radius: 4px;
  box-sizing: border-box;
`;

const IconTextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;
