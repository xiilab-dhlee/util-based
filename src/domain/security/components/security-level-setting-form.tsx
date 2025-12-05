"use client";

import { useEffect } from "react";
import styled from "styled-components";
import {
  Dropdown,
  Form,
  FormItem,
  InputNumber,
  Radio,
  Typography,
} from "xiilab-ui";

import {
  type SecurityLevelSettingFormValue,
  useSecurityLevelSettingForm,
} from "@/domain/security/hooks/use-security-level-setting-form";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import {
  DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT,
  SECURITY_LEVEL_THRESHOLD_MAX,
  SECURITY_LEVEL_THRESHOLD_MIN,
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_ENABLED,
  SECURITY_USAGE_OPTIONS,
  type SecurityLevelKey,
  type SecurityUsageStatus,
} from "@/shared/constants/security.constant";
import { VULNERABILITY_LEVEL_KEYS } from "@/shared/constants/vulnerability.constant";
import { getVulnerabilityLevelsForSelect } from "@/shared/utils/vulnerability.util";

const SECURITY_LEVEL_OPTIONS = getVulnerabilityLevelsForSelect();

interface SecurityLevelSettingFormProps {
  onSubmit: (value: SecurityLevelSettingFormValue) => void;
  formRef?: { current: SecurityLevelSettingFormHandle | null };
}

export interface SecurityLevelSettingFormHandle {
  submit: () => void;
}

export function SecurityLevelSettingForm({
  onSubmit,
  formRef,
}: SecurityLevelSettingFormProps) {
  const { formState, errors, setField, validate } =
    useSecurityLevelSettingForm();

  const usageStatus: SecurityUsageStatus = formState.isEnabled
    ? SECURITY_USAGE_ENABLED
    : SECURITY_USAGE_DISABLED;

  const isDisabled = usageStatus === SECURITY_USAGE_DISABLED;

  useEffect(() => {
    if (!formRef) return;

    formRef.current = {
      submit: () => {
        const payload = validate();
        if (!payload) return;
        onSubmit(payload);
      },
    };

    return () => {
      formRef.current = null;
    };
  }, [formRef, onSubmit, validate]);

  return (
    <Form layout="vertical">
      <FormItem label="보안 레벨 기능 사용 여부" required>
        <RadioGroup>
          {SECURITY_USAGE_OPTIONS.map((option) => (
            <RadioItem key={option.key}>
              <Radio
                value={option.key}
                label={option.label}
                checked={usageStatus === option.key}
                onClick={() =>
                  setField("isEnabled", option.key === SECURITY_USAGE_ENABLED)
                }
                size="small"
              />
            </RadioItem>
          ))}
        </RadioGroup>
      </FormItem>

      <FormItem
        label={
          <LabelRow>
            <Typography.Text variant="body-2-1">설정 기준</Typography.Text>
            <GuideTooltip
              placement="bottom"
              title={
                <>
                  기준을 설정하는 경우, 해당 항목보다 높은 기준의
                  <br />
                  취약점이 발견되면 사용할 수 없습니다
                </>
              }
            />
          </LabelRow>
        }
        required
      >
        <CriteriaRow>
          <CriteriaItem>
            <Dropdown
              options={SECURITY_LEVEL_OPTIONS.map((level) => ({
                label: level.label,
                value: level.key,
              }))}
              value={formState.level}
              onChange={(value) =>
                setField(
                  "level",
                  (value || VULNERABILITY_LEVEL_KEYS[0]) as SecurityLevelKey,
                )
              }
              placeholder="레벨 선택"
              status={errors.level ? "error" : "default"}
              width="100%"
              disabled={isDisabled}
            />
          </CriteriaItem>
          <CriteriaItem>
            <InputNumber
              height={30}
              min={SECURITY_LEVEL_THRESHOLD_MIN}
              max={SECURITY_LEVEL_THRESHOLD_MAX}
              controls={true}
              value={formState.thresholdCount}
              onChange={(value) =>
                setField(
                  "thresholdCount",
                  (value ?? DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT) as number,
                )
              }
              status={errors.thresholdCount ? "error" : "default"}
              disabled={isDisabled}
            />
          </CriteriaItem>
          <Typography.Text variant="body-2-2">개 이상</Typography.Text>
        </CriteriaRow>
      </FormItem>
    </Form>
  );
}

const RadioGroup = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 2px;
  background-color: #ffffff;
`;

const RadioItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;

  & + & {
    border-left: 1px solid #e9ebee;
  }
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CriteriaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CriteriaItem = styled.div`
  flex: 1;

  & > * {
    width: 100%;
  }
`;
