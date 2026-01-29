"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styled from "styled-components";
import {
  Dropdown,
  Form,
  FormItem,
  Icon,
  InputNumber,
  Modal,
  Radio,
  Typography,
} from "xiilab-ui";

import type { VulnerabilityLevelPolicyUpdateRequestSeverity } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  getGetLevelPolicyQueryKey,
  useGetLevelPolicy,
  useUpdateLevelPolicy,
} from "@/api/generated/vulnerability-policy-admin/vulnerability-policy-admin";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
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
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { getVulnerabilityLevelsForSelect } from "@/shared/utils/vulnerability.util";

const DEFAULT_SECURITY_LEVEL: SecurityLevelKey = VULNERABILITY_LEVEL_KEYS[0];

function isValidSecurityLevelKey(value: string): value is SecurityLevelKey {
  return (VULNERABILITY_LEVEL_KEYS as readonly string[]).includes(value);
}

function toSecurityLevelKey(severity: string | undefined): SecurityLevelKey {
  if (!severity) {
    return DEFAULT_SECURITY_LEVEL;
  }
  const normalized = severity.toLowerCase();
  return isValidSecurityLevelKey(normalized)
    ? normalized
    : DEFAULT_SECURITY_LEVEL;
}

const SECURITY_LEVEL_OPTIONS = getVulnerabilityLevelsForSelect();

interface SecurityLevelSettingFormValue {
  isEnabled: boolean;
  level: SecurityLevelKey;
  thresholdCount: number;
}

export function SecurityLevelSettingModal() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // 보안 레벨 정책 조회
  const {
    data: levelPolicy,
    isError: isLevelPolicyError,
    error: levelPolicyError,
  } = useGetLevelPolicy();

  const { control, handleSubmit, watch, reset } =
    useForm<SecurityLevelSettingFormValue>({
      defaultValues: {
        isEnabled: true,
        level: DEFAULT_SECURITY_LEVEL,
        thresholdCount: DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT,
      },
    });

  // 조회된 데이터로 폼 초기화
  useEffect(() => {
    // 1) 데이터가 있으면 해당 값으로 초기화
    if (levelPolicy) {
      const validatedLevel = toSecurityLevelKey(levelPolicy.severity);
      reset({
        isEnabled: levelPolicy.isRestrictionEnabled,
        level: validatedLevel,
        thresholdCount: levelPolicy.severityCount,
      });
      return;
    }

    // 2) 데이터가 없고 에러일 때만 기본값으로 초기화
    if (isLevelPolicyError) {
      console.error(
        "보안 레벨 정책 조회에 실패했습니다. 기본값을 사용합니다.",
        levelPolicyError,
      );
      reset({
        isEnabled: true,
        level: DEFAULT_SECURITY_LEVEL,
        thresholdCount: DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT,
      });
    }
  }, [levelPolicy, isLevelPolicyError, levelPolicyError, reset]);

  useSubscribe(REGISTRY_EVENTS.openSecurityLevelSettingModal, () => {
    setOpen(true);
  });

  // 보안 레벨 정책 수정
  const updateLevelMutation = useUpdateLevelPolicy({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetLevelPolicyQueryKey(),
        });
        handleClose();
      },
    },
  });

  const isEnabled = watch("isEnabled");
  const usageStatus: SecurityUsageStatus = isEnabled
    ? SECURITY_USAGE_ENABLED
    : SECURITY_USAGE_DISABLED;
  const isDisabled = usageStatus === SECURITY_USAGE_DISABLED;

  const handleClose = () => setOpen(false);

  const onSubmit = (formData: SecurityLevelSettingFormValue) => {
    updateLevelMutation.mutate({
      data: {
        hasEnabled: formData.isEnabled,
        severity:
          formData.level.toUpperCase() as VulnerabilityLevelPolicyUpdateRequestSeverity,
        severityCount: formData.thresholdCount,
      },
    });
  };

  const handleModalOk = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <Modal
      type="primary"
      icon={<Icon name="SecurityCheck" color="#fff" size={18} />}
      modalWidth={370}
      open={open}
      closable
      title="보안 레벨 설정"
      showCancelButton
      cancelText="취소"
      onCancel={handleClose}
      okText="저장"
      onOk={handleModalOk}
      centered
      showHeaderBorder
    >
      <SettingGuideBox>
        <SettingGuideText>
          보안 레벨 기능을 <SettingGuideHighlight>'사용'</SettingGuideHighlight>
          으로 설정하면, 설정 변경 이후 업로드되는 컨테이너 이미지부터 보안
          기준이 적용됩니다.
        </SettingGuideText>
        <SettingGuideText>
          <SettingGuideHighlight>'미사용'</SettingGuideHighlight>으로 변경할
          경우, 기존에 승인 대상이었던 이미지도 모두 사용 가능 상태로
          전환됩니다.
        </SettingGuideText>
      </SettingGuideBox>
      <Form layout="vertical">
        <FormItem label="보안 레벨 기능 사용 여부">
          <Controller
            name="isEnabled"
            control={control}
            render={({ field }) => (
              <RadioGroup>
                {SECURITY_USAGE_OPTIONS.map((option) => (
                  <RadioItem key={option.key}>
                    <Radio
                      value={option.key}
                      label={option.label}
                      checked={
                        (field.value
                          ? SECURITY_USAGE_ENABLED
                          : SECURITY_USAGE_DISABLED) === option.key
                      }
                      onClick={() =>
                        field.onChange(option.key === SECURITY_USAGE_ENABLED)
                      }
                      size="small"
                    />
                  </RadioItem>
                ))}
              </RadioGroup>
            )}
          />
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
        >
          <CriteriaRow>
            <CriteriaItem>
              <Controller
                name="level"
                control={control}
                render={({ field, fieldState }) => (
                  <Dropdown
                    options={SECURITY_LEVEL_OPTIONS.map((level) => ({
                      label: level.label,
                      value: level.key,
                    }))}
                    value={field.value}
                    onChange={(value) =>
                      field.onChange(
                        (value ||
                          VULNERABILITY_LEVEL_KEYS[0]) as SecurityLevelKey,
                      )
                    }
                    placeholder="레벨 선택"
                    status={fieldState.error ? "error" : "default"}
                    width="100%"
                    disabled={isDisabled}
                  />
                )}
              />
            </CriteriaItem>
            <CriteriaItem>
              <Controller
                name="thresholdCount"
                control={control}
                rules={{
                  required: true,
                  min: SECURITY_LEVEL_THRESHOLD_MIN,
                  max: SECURITY_LEVEL_THRESHOLD_MAX,
                }}
                render={({ field, fieldState }) => (
                  <InputNumber
                    height={30}
                    min={SECURITY_LEVEL_THRESHOLD_MIN}
                    max={SECURITY_LEVEL_THRESHOLD_MAX}
                    controls={true}
                    value={field.value}
                    onChange={(value) =>
                      field.onChange(
                        value ?? DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT,
                      )
                    }
                    status={fieldState.error ? "error" : "default"}
                    disabled={isDisabled}
                  />
                )}
              />
            </CriteriaItem>
            <Typography.Text variant="body-2-2">개 이상</Typography.Text>
          </CriteriaRow>
        </FormItem>
      </Form>
    </Modal>
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
  justify-content: flex-start;
  align-items: center;
  padding: 8px 12px;


  & .ant-radio-wrapper .ant-radio+span {
    margin-left: 0 !important;
  }

  & + & {
    border-left: 1px solid #e9ebee;
  }
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 3px;
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

const SettingGuideBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  background-color: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const SettingGuideText = styled.p`
  font-size: 13px;
  font-weight: 400;
  color: #000;
  line-height: 1.6;
  margin: 0;
`;

const SettingGuideHighlight = styled.span`
  font-weight: 700;
  color: var(--color-blue-04);
`;
