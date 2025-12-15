"use client";

import type { ComponentProps, ComponentType } from "react";
import { useCallback, useEffect } from "react";
import styled from "styled-components";
import {
  DatePicker,
  Dropdown,
  Form,
  FormItem,
  InputNumber,
  Radio,
  Typography,
} from "xiilab-ui";

import {
  type SecurityScheduleSettingFormValue,
  useSecurityScheduleSettingForm,
} from "@/domain/security/hooks/use-security-schedule-setting-form";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import {
  SECURITY_SCHEDULE_PERIOD_UNIT_DAY,
  SECURITY_SCHEDULE_PERIOD_UNIT_WEEK,
  SECURITY_SCHEDULE_PERIOD_UNITS,
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_OPTIONS,
  SECURITY_WEEK_DAYS,
  type SecuritySchedulePeriodUnit,
  type SecurityUsageStatus,
  type SecurityWeekDayKey,
} from "@/shared/constants/security.constant";

export interface SecurityScheduleSettingFormHandle {
  submit: () => void;
}

interface SecurityScheduleSettingFormProps {
  onSubmit: (value: SecurityScheduleSettingFormValue) => void;
  formRef?: { current: SecurityScheduleSettingFormHandle | null };
}

export function SecurityScheduleSettingForm({
  onSubmit,
  formRef,
}: SecurityScheduleSettingFormProps) {
  const { formState, setField, validate, errors } =
    useSecurityScheduleSettingForm();

  const scheduleUsage: SecurityUsageStatus = formState.scheduleUsage;
  const isScheduleDisabled = scheduleUsage === SECURITY_USAGE_DISABLED;
  const isDayUnit = formState.periodUnit === SECURITY_SCHEDULE_PERIOD_UNIT_DAY;

  const handleToggleWeekDay = (dayKey: SecurityWeekDayKey) => {
    const hasDay = formState.weekDays.includes(dayKey);
    const nextWeekDays = hasDay
      ? formState.weekDays.filter((key) => key !== dayKey)
      : [...formState.weekDays, dayKey];

    setField("weekDays", nextWeekDays);
  };

  const handleSubmit = useCallback(() => {
    const payload = validate();
    if (!payload) return;
    onSubmit(payload);
  }, [onSubmit, validate]);

  useEffect(() => {
    if (!formRef) return;

    formRef.current = {
      submit: handleSubmit,
    };

    return () => {
      formRef.current = null;
    };
  }, [formRef, handleSubmit]);

  return (
    <Form layout="vertical">
      <FormItem label="정기 보안 검사 사용" required>
        <RadioRow>
          {SECURITY_USAGE_OPTIONS.map((option) => (
            <RadioItem key={option.key}>
              <Radio
                value={option.key}
                label={option.label}
                checked={formState.scheduleUsage === option.key}
                onClick={() => setField("scheduleUsage", option.key)}
                size="small"
              />
            </RadioItem>
          ))}
        </RadioRow>
      </FormItem>

      <FormItem label="검사 시작일시" required>
        <StyledDatePicker
          selected={formState.startDateTime}
          onChange={(date) => {
            if (!date) return;
            setField("startDateTime", date);
          }}
          placeholder="시작일시를 선택해 주세요."
          width="100%"
          height={30}
          withTime
          disablePastTime
          disabled={isScheduleDisabled}
        />
      </FormItem>
      <FormItem label="">
        <LabelRow>
          <Typography.Text variant="body-2-2">
            검사 주기<RequiredMark> *</RequiredMark>
          </Typography.Text>
          <GuideTooltip
            placement="bottom"
            title={
              <>
                29, 30, 31일로 설정하는 경우, 해당 날짜가 없는
                <br />
                월에는 말일에 검사가 진행됩니다.
              </>
            }
          />
        </LabelRow>
        <PeriodRow>
          <PeriodValue>
            <InputNumber
              width="100%"
              height={30}
              min={1}
              max={isDayUnit ? 31 : undefined}
              controls={true}
              value={formState.periodValue}
              disabled={isScheduleDisabled}
              onChange={(value) =>
                setField("periodValue", (value ?? 1) as number)
              }
              status={errors.periodValue ? "error" : "default"}
            />
          </PeriodValue>
          <PeriodUnit>
            <Dropdown
              options={SECURITY_SCHEDULE_PERIOD_UNITS.map((unit) => ({
                label: unit.label,
                value: unit.key,
              }))}
              value={formState.periodUnit}
              width="100%"
              height={30}
              disabled={isScheduleDisabled}
              onChange={(value) =>
                setField(
                  "periodUnit",
                  (value ||
                    SECURITY_SCHEDULE_PERIOD_UNIT_DAY) as SecuritySchedulePeriodUnit,
                )
              }
              status={errors.periodUnit ? "error" : "default"}
            />
          </PeriodUnit>
        </PeriodRow>
      </FormItem>
      {formState.periodUnit === SECURITY_SCHEDULE_PERIOD_UNIT_WEEK && (
        <FormItem label="검사 요일" required>
          <WeekDaysRow>
            {SECURITY_WEEK_DAYS.map((day) => (
              <WeekDayItem key={day.key}>
                <Radio
                  value={day.key}
                  label={day.label}
                  checked={formState.weekDays.includes(day.key)}
                  onClick={() => handleToggleWeekDay(day.key)}
                  size="small"
                  disabled={isScheduleDisabled}
                />
              </WeekDayItem>
            ))}
          </WeekDaysRow>
        </FormItem>
      )}
      <FormItem label="종료 날짜 지정" required>
        <RadioRow>
          {SECURITY_USAGE_OPTIONS.map((option) => (
            <RadioItem key={option.key}>
              <Radio
                value={option.key}
                label={option.label}
                checked={formState.endDateUsage === option.key}
                onClick={() => setField("endDateUsage", option.key)}
                size="small"
                disabled={isScheduleDisabled}
              />
            </RadioItem>
          ))}
        </RadioRow>
      </FormItem>

      {formState.endDateUsage !== SECURITY_USAGE_DISABLED && (
        <FormItem label="종료 날짜" required>
          <StyledDatePicker
            selected={formState.endDateTime || null}
            onChange={(date) => {
              setField("endDateTime", date ?? null);
            }}
            placeholder="종료일을 선택해 주세요."
            width="100%"
            height={30}
            minDateTime={formState.startDateTime}
            disabled={isScheduleDisabled}
          />
        </FormItem>
      )}
    </Form>
  );
}

const RadioRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border: 1px solid #e1e4e7;
  border-radius: 2px;
  background-color: #fafafa;
`;

const RadioItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const PeriodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PeriodValue = styled.div`
  flex: 3;
`;

const PeriodUnit = styled.div`
  flex: 7;
`;

const RequiredMark = styled.span`
  color: #f04438;
`;

const WeekDaysRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WeekDayItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type DatePickerWithDisabledProps = ComponentProps<typeof DatePicker> & {
  disabled?: boolean;
};

const BaseDatePicker = DatePicker as ComponentType<DatePickerWithDisabledProps>;

const StyledDatePicker = styled(BaseDatePicker)`
  & input {
    background-color: #fafafa !important;
    border-color: #b9bec3 !important;
    font-size: 12px;
  }
`;
