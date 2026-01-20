"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Dropdown, InputNumber } from "xiilab-ui";

import {
  DURATION_UNIT,
  EMPTY_THRESHOLD_SETTING,
  METRIC_TYPE_OPTIONS,
  OPERATOR_OPTIONS,
  THRESHOLD_UNIT,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import type { ThresholdFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";

// ===== Types =====

interface ThresholdItemErrors {
  metric?: string;
  operator?: string;
  value?: string;
  durationMinutes?: string;
}

interface ManageMonitoringNotificationSettingsProps {
  settings?: ThresholdFormType[];
  onChange?: (nextSettings: ThresholdFormType[]) => void;
  errors?: (ThresholdItemErrors | undefined)[];
  disabled?: boolean;
}

// ===== Helpers =====

const isRowComplete = (setting: ThresholdFormType): boolean => {
  const fields = [
    setting.metric,
    setting.operator,
    setting.value,
    setting.durationMinutes,
  ];
  return fields.every((f) => f && f.trim().length > 0);
};

// ===== Component =====

export function ManageMonitoringNotificationSetting({
  settings = [],
  onChange,
  errors,
  disabled = false,
}: ManageMonitoringNotificationSettingsProps) {
  // 입력 행 상태 (내부 관리)
  const [inputRow, setInputRow] = useState<ThresholdFormType>(
    EMPTY_THRESHOLD_SETTING,
  );

  // settings가 빈 배열로 초기화되면 inputRow도 초기화
  useEffect(() => {
    if (settings.length === 0) {
      setInputRow(EMPTY_THRESHOLD_SETTING);
    }
  }, [settings]);

  const handleInputChange = (
    field: keyof ThresholdFormType,
    value: string | number | null,
  ) => {
    setInputRow((prev) => ({
      ...prev,
      [field]: value?.toString() ?? "",
    }));
  };

  // 같은 항목이 이미 있는지 확인
  const isDuplicateMetric = (metric: string): boolean => {
    return settings.some((s) => s.metric === metric);
  };

  const handleAddSetting = () => {
    if (isRowComplete(inputRow) && !isDuplicateMetric(inputRow.metric)) {
      // 최근 추가된 항목이 위에 오도록 (앞에 추가)
      onChange?.([inputRow, ...settings]);
      setInputRow(EMPTY_THRESHOLD_SETTING);
    }
  };

  const canAdd = isRowComplete(inputRow) && !isDuplicateMetric(inputRow.metric);

  const handleDeleteSetting = (index: number) => {
    onChange?.(settings.filter((_, i) => i !== index));
  };

  return (
    <Container>
      <Body>
        {/* 헤더 행 */}
        <Column>
          <Field>
            <HeaderTitle>항목</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>연산자</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>임계값</HeaderTitle>
          </Field>
          <Field>
            <HeaderTitle>지속시간</HeaderTitle>
          </Field>
          {!disabled && <Actions />}
        </Column>

        {/* 입력 행 */}
        {!disabled && (
          <Column>
            <Field>
              <Dropdown
                status={
                  inputRow.metric && isDuplicateMetric(inputRow.metric)
                    ? "error"
                    : "default"
                }
                options={METRIC_TYPE_OPTIONS}
                placeholder="항목 선택"
                onChange={(value: string | null) =>
                  handleInputChange("metric", value)
                }
                value={inputRow.metric || null}
                width="100%"
                height={30}
              />
            </Field>
            <Field>
              <Dropdown
                options={OPERATOR_OPTIONS}
                placeholder="연산자 선택"
                onChange={(value: string | null) =>
                  handleInputChange("operator", value)
                }
                value={inputRow.operator || null}
                width="100%"
                height={30}
              />
            </Field>
            <Field>
              <InputNumber
                width="100%"
                height={30}
                min={1}
                max={100}
                suffix={THRESHOLD_UNIT}
                value={
                  inputRow.value === "" ? undefined : Number(inputRow.value)
                }
                onChange={(value) => handleInputChange("value", value)}
                autoComplete="off"
              />
            </Field>
            <Field>
              <InputNumber
                width="100%"
                height={30}
                min={1}
                suffix={DURATION_UNIT}
                value={
                  inputRow.durationMinutes === ""
                    ? undefined
                    : Number(inputRow.durationMinutes)
                }
                onChange={(value) =>
                  handleInputChange("durationMinutes", value)
                }
                autoComplete="off"
              />
            </Field>
            <Actions>
              <Button
                icon="Plus"
                iconSize={18}
                onClick={handleAddSetting}
                disabled={!canAdd}
              />
            </Actions>
          </Column>
        )}

        {/* 저장된 목록 */}
        {settings.length > 0 && (
          <BodyRow>
            {settings.map((setting, index) => {
              const itemErrors = errors?.[index];

              return (
                <Column key={`threshold-${setting.metric || index}`}>
                  <Field>
                    <Dropdown
                      status={itemErrors?.metric ? "error" : "default"}
                      options={METRIC_TYPE_OPTIONS}
                      placeholder="항목 선택"
                      value={setting.metric || null}
                      width="100%"
                      height={30}
                      disabled
                    />
                  </Field>
                  <Field>
                    <Dropdown
                      status={itemErrors?.operator ? "error" : "default"}
                      options={OPERATOR_OPTIONS}
                      placeholder="연산자 선택"
                      value={setting.operator || null}
                      width="100%"
                      height={30}
                      disabled
                    />
                  </Field>
                  <Field>
                    <InputNumber
                      status={itemErrors?.value ? "error" : "default"}
                      width="100%"
                      height={30}
                      min={1}
                      max={100}
                      suffix={THRESHOLD_UNIT}
                      value={
                        setting.value === "" ? undefined : Number(setting.value)
                      }
                      autoComplete="off"
                      disabled
                    />
                  </Field>
                  <Field>
                    <InputNumber
                      status={itemErrors?.durationMinutes ? "error" : "default"}
                      width="100%"
                      height={30}
                      min={1}
                      suffix={DURATION_UNIT}
                      value={
                        setting.durationMinutes === ""
                          ? undefined
                          : Number(setting.durationMinutes)
                      }
                      autoComplete="off"
                      disabled
                    />
                  </Field>
                  {!disabled && (
                    <Actions>
                      <Button
                        icon="Close"
                        iconSize={18}
                        onClick={() => handleDeleteSetting(index)}
                      />
                    </Actions>
                  )}
                </Column>
              );
            })}
          </BodyRow>
        )}
      </Body>
    </Container>
  );
}

// ===== Styled Components =====

const Container = styled.div``;

const Body = styled.div`
  border-radius: 4px;
  border: 1px solid #d1d5dc;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 6px;
  position: relative;
  width: 100%;
`;

const HeaderTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  border-radius: 4px;

  & > :first-child {
    flex: 1.5;
  }
`;

const Field = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Actions = styled.div`
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 6px;

  & > button {
    width: 30px !important;
    height: 30px !important;
  }
`;

const BodyRow = styled.div`
  height: 138px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
