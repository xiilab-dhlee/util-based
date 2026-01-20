import styled from "styled-components";

import type {
  NotificationSetResponse,
  NotificationSetResponseNotificationType,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { NotificationSettingSwitch } from "@/domain/setting/components/notification-setting/notification-setting-switch";
import {
  NOTIFICATION_SET_LABELS,
  type NotificationChannel,
} from "@/domain/setting/constants/notification-setting.constant";

interface NotificationSettingSectionProps {
  title: string;
  section: NotificationSetResponseNotificationType;
  items: NotificationSetResponse[];
  isSwitchDisabled: boolean;
  isLoading?: boolean;
  onToggle: (
    notificationSet: NotificationSetResponse,
    channel: NotificationChannel,
    checked: boolean,
  ) => void;
}

export function NotificationSettingSection({
  title,
  section,
  items,
  isSwitchDisabled,
  isLoading = false,
  onToggle,
}: NotificationSettingSectionProps) {
  const sectionLabels = Object.entries(NOTIFICATION_SET_LABELS)
    .filter(([_, config]) => config.section === section)
    .map(([name, config]) => ({ name, label: config.label }));

  if (sectionLabels.length === 0) return null;

  const isDisabled = isSwitchDisabled || isLoading;

  const getItemByName = (name: string) =>
    items.find((item) => item.notificationSetName === name);

  if (section === "WORKSPACE") {
    return (
      <WorkspaceSection>
        <SectionTitle>{title}</SectionTitle>
        {sectionLabels.map(({ name, label }) => {
          const notificationSet = getItemByName(name);

          return (
            <Box key={name}>
              <WorkspaceContent>
                <WorkspaceNotificationItem>
                  <ItemLabel>{label}</ItemLabel>
                </WorkspaceNotificationItem>
                <NotificationSettingSwitch
                  variant="workspace"
                  isSystemEnabled={
                    notificationSet?.isSystemNotificationEnabled ?? false
                  }
                  isEmailEnabled={
                    notificationSet?.isEmailNotificationEnabled ?? false
                  }
                  onSystemChange={(checked) =>
                    notificationSet &&
                    onToggle(notificationSet, "SYSTEM", checked)
                  }
                  onEmailChange={(checked) =>
                    notificationSet &&
                    onToggle(notificationSet, "EMAIL", checked)
                  }
                  disabled={isDisabled || !notificationSet}
                />
              </WorkspaceContent>
            </Box>
          );
        })}
      </WorkspaceSection>
    );
  }

  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
      <WorkloadGrid>
        {sectionLabels.map(({ name, label }) => {
          const notificationSet = getItemByName(name);

          return (
            <Box key={name}>
              <NotificationItem>
                <ItemLabel>{label}</ItemLabel>
                <NotificationSettingSwitch
                  variant="workload"
                  isSystemEnabled={
                    notificationSet?.isSystemNotificationEnabled ?? false
                  }
                  isEmailEnabled={
                    notificationSet?.isEmailNotificationEnabled ?? false
                  }
                  onSystemChange={(checked) =>
                    notificationSet &&
                    onToggle(notificationSet, "SYSTEM", checked)
                  }
                  onEmailChange={(checked) =>
                    notificationSet &&
                    onToggle(notificationSet, "EMAIL", checked)
                  }
                  disabled={isDisabled || !notificationSet}
                />
              </NotificationItem>
            </Box>
          );
        })}
      </WorkloadGrid>
    </Section>
  );
}

const Box = styled.div`
    display: flex;
    align-items: center;

    height: 100%;
    width: 100%;
    border: 1px solid #E9E9E9;
`;
const WorkspaceSection = styled.div`
  margin-bottom: 16px;
`;

const WorkspaceContent = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const Section = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WorkloadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 6px;
`;

const SectionTitle = styled.h3`
  color: #000;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  margin-bottom: 4px;
  margin-top: 0;
`;

const NotificationItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`;

const WorkspaceNotificationItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ItemLabel = styled.span`
  color: #000;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 12px;
  display: block;

  ${WorkspaceNotificationItem} & {
    margin-bottom: 0;
  }
`;
