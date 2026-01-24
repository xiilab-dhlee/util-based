"use client";

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

import { securityLevelSettingModal } from "@/domain/registry/utils/security-level-setting-modal.util";
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

interface SecurityLevelSettingFormValue {
  isEnabled: boolean;
  level: SecurityLevelKey;
  thresholdCount: number;
}

export function SecurityLevelSettingModal() {
  const [open, setOpen] = useState(false);

  const { control, handleSubmit, watch } =
    useForm<SecurityLevelSettingFormValue>({
      defaultValues: {
        isEnabled: true,
        level: VULNERABILITY_LEVEL_KEYS[0],
        thresholdCount: DEFAULT_SECURITY_LEVEL_THRESHOLD_COUNT,
      },
    });

  useEffect(() => {
    return securityLevelSettingModal.subscribe(() => {
      setOpen(true);
    });
  }, []);

  const isEnabled = watch("isEnabled");
  const usageStatus: SecurityUsageStatus = isEnabled
    ? SECURITY_USAGE_ENABLED
    : SECURITY_USAGE_DISABLED;
  const isDisabled = usageStatus === SECURITY_USAGE_DISABLED;

  const handleClose = () => setOpen(false);

  const onSubmit = () => {};

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
