"use client";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { Controller, type FieldErrors } from "react-hook-form";
import styled from "styled-components";
import { Checkbox, FormItem, Icon, Input } from "xiilab-ui";

import { ManageMonitoringNotificationSetting } from "@/domain/monitoring-notification/components/manage-monitoring-notification-setting";
import { MONITORING_NOTIFICATION_FIELD_IDS } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import type {
  NotificationChannelSectionProps,
  NotificationInfoSectionProps,
  NotificationSettingsSectionProps,
  ThresholdFieldError,
} from "@/domain/monitoring-notification/types/monitoring-notification.type";
import type { NotificationFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";
import { MultiSelectWithAll } from "@/shared/components/select";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { errorTextStyle, TooltipHighlightText } from "@/styles/mixins/text";

// ===== Helpers =====

const createCheckboxChangeHandler =
  (onChange: (value: boolean) => void) => (e: CheckboxChangeEvent) =>
    onChange(e.target.checked);

const thresholdTooltipTitle = (
  <>
    <TooltipHighlightText>MIG</TooltipHighlightText>와{" "}
    <TooltipHighlightText>MPS</TooltipHighlightText>는 임계치 설정이
    불가능합니다. <br />
    <TooltipHighlightText>Normal GPU</TooltipHighlightText>에 대해서만 알림
    설정이 가능합니다. <br />각 조건은{" "}
    <TooltipHighlightText>OR</TooltipHighlightText> 조건으로 적용됩니다.
  </>
);

function extractThresholdErrors(
  errors: FieldErrors<NotificationFormType>,
): (ThresholdFieldError | undefined)[] | undefined {
  const thresholdErrors = errors.threshold;
  if (!thresholdErrors || !Array.isArray(thresholdErrors)) return undefined;

  return thresholdErrors.map((fieldError) => {
    if (!fieldError) return undefined;
    return {
      metric: fieldError.metric?.message,
      operator: fieldError.operator?.message,
      value: fieldError.value?.message,
      durationMinutes: fieldError.durationMinutes?.message,
    };
  });
}

// ===== Components =====

export function NotificationChannelSection({
  control,
  errors,
  disabled = false,
}: NotificationChannelSectionProps) {
  const channelError = errors.isEmailNotificationEnabled?.message;

  return (
    <FormItem label="알림 유형" required>
      <ChannelRow>
        <Channels>
          <ChannelItem>
            <ChannelKey>
              <Icon name="MailFilled" size={22} />
              E-mail
            </ChannelKey>
            <Controller
              name="isEmailNotificationEnabled"
              control={control}
              render={({ field }) => (
                <Checkbox
                  size="small"
                  checked={field.value}
                  onChange={createCheckboxChangeHandler(field.onChange)}
                  disabled={disabled}
                />
              )}
            />
          </ChannelItem>
          <ChannelItem>
            <ChannelKey>
              <Icon name="SystemFilled" size={22} />
              System
            </ChannelKey>
            <Controller
              name="isSystemNotificationEnabled"
              control={control}
              render={({ field }) => (
                <Checkbox
                  size="small"
                  checked={field.value}
                  onChange={createCheckboxChangeHandler(field.onChange)}
                  disabled={disabled}
                />
              )}
            />
          </ChannelItem>
        </Channels>
      </ChannelRow>
      {channelError && <ChannelErrorText>{channelError}</ChannelErrorText>}
    </FormItem>
  );
}

export function NotificationInfoSection({
  control,
  errors,
  nodeOptions,
  isNodeNamesLoading = false,
  disabled = false,
}: NotificationInfoSectionProps) {
  return (
    <>
      <Controller
        name="notificationSetName"
        control={control}
        render={({ field }) => (
          <FormItem
            label="알림 이름"
            required
            htmlFor={MONITORING_NOTIFICATION_FIELD_IDS.notificationSetName}
            validateStatus={errors.notificationSetName ? "error" : undefined}
            help={errors.notificationSetName?.message}
          >
            <Input
              {...field}
              id={MONITORING_NOTIFICATION_FIELD_IDS.notificationSetName}
              type="text"
              placeholder="알림 이름을 입력해 주세요."
              width="100%"
              disabled={disabled}
              status={errors.notificationSetName ? "error" : undefined}
            />
          </FormItem>
        )}
      />

      <Controller
        name="nodeName"
        control={control}
        render={({ field }) => (
          <FormItem
            label="노드"
            required
            htmlFor={MONITORING_NOTIFICATION_FIELD_IDS.nodeName}
            validateStatus={errors.nodeName ? "error" : undefined}
            help={errors.nodeName?.message}
          >
            <MultiSelectWithAll
              id={MONITORING_NOTIFICATION_FIELD_IDS.nodeName}
              options={nodeOptions}
              value={field.value}
              onChange={field.onChange}
              disabled={isNodeNamesLoading || disabled}
              width={565}
            />
          </FormItem>
        )}
      />
    </>
  );
}

export function NotificationSettingsSection({
  control,
  errors,
  disabled = false,
}: NotificationSettingsSectionProps) {
  // threshold 배열 자체의 에러 메시지 (min 1개 필요)
  const thresholdRootError =
    errors.threshold?.root?.message || errors.threshold?.message;

  return (
    <SettingsFormItem
      label={
        <SettingsLabel>
          알림 임계 조건 설정
          <RequiredMark>*</RequiredMark>
          <GuideTooltip title={thresholdTooltipTitle} />
        </SettingsLabel>
      }
      validateStatus={thresholdRootError ? "error" : undefined}
      help={thresholdRootError}
    >
      <Controller
        name="threshold"
        control={control}
        render={({ field }) => (
          <ManageMonitoringNotificationSetting
            settings={field.value}
            onChange={field.onChange}
            errors={extractThresholdErrors(errors)}
            disabled={disabled}
          />
        )}
      />
    </SettingsFormItem>
  );
}

// ===== Styled Components =====

const ChannelRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e9e9e9;
  background-color: #fff;
  padding: 8px 12px;
  border-radius: 2px;
  position: relative;
`;

const Channels = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 4px 0;
`;

const ChannelItem = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;

  & + & {
    border-left: 1px solid #e9ebee;
  }
`;

const ChannelKey = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #333333;
`;

const ChannelErrorText = styled.span`
  position: absolute;
  left: 0;
  bottom: -20px;
  ${errorTextStyle}
`;

const SettingsLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const RequiredMark = styled.span`
  color: var(--color-red-09);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
`;

const SettingsFormItem = styled(FormItem)``;
