"use client";
import styled from "styled-components";
import { Button, Dropdown, InputNumber } from "xiilab-ui";

import {
  EMPTY_NOTIFICATION_SETTING,
  MONITORING_NOTIFICATION_DURATION_UNIT,
  MONITORING_NOTIFICATION_OPERATOR_OPTIONS,
  MONITORING_NOTIFICATION_THRESHOLD_UNIT,
  MONITORING_NOTIFICATION_TYPE_OPTIONS,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import type { MonitoringNotificationSettingFormType } from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";

/** 개별 설정 항목의 필드별 에러 타입 */
interface SettingItemErrors {
  item?: string;
  operator?: string;
  threshold?: string;
  duration?: string;
}

interface ManageMonitoringNotificationSettingsProps {
  settings?: MonitoringNotificationSettingFormType[];
  onChange?: (nextSettings: MonitoringNotificationSettingFormType[]) => void;
  /** 개별 설정 항목의 에러 배열 (Zod 검증 결과) */
  errors?: SettingItemErrors[];
  disabled?: boolean;
}

type ConditionRowStatus = "complete" | "empty" | "incomplete";

const getConditionRowStatus = (
  setting: MonitoringNotificationSettingFormType,
): ConditionRowStatus => {
  const fields = [
    setting.item,
    setting.operator,
    setting.threshold,
    setting.duration,
  ];
  const filledCount = fields.filter((f) => f && f.trim().length > 0).length;

  if (filledCount === 4) return "complete";
  if (filledCount === 0) return "empty";
  return "incomplete";
};

export function ManageMonitoringNotificationSetting({
  settings,
  onChange,
  errors,
  disabled = false,
}: ManageMonitoringNotificationSettingsProps) {
  const safeSettings =
    settings && settings.length > 0 ? settings : [EMPTY_NOTIFICATION_SETTING];

  const updateSettings = (
    updater: (
      prev: MonitoringNotificationSettingFormType[],
    ) => MonitoringNotificationSettingFormType[],
  ) => {
    const next = updater(safeSettings);
    onChange?.(next);
  };

  const handleDeleteSetting = (index: number) => {
    if (safeSettings.length > 1) {
      updateSettings((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 필드 변경 핸들러
  const handleFieldChange = (
    index: number,
    field: keyof MonitoringNotificationSettingFormType,
    value: string | number | null,
  ) => {
    updateSettings((prev) => {
      const newSettings = [...prev];

      const finalValue = value?.toString() ?? "";
      newSettings[index] = { ...newSettings[index], [field]: finalValue };
      return newSettings;
    });
  };

  return (
    <div>
      <Body>
        {/* 컬럼 헤더 */}
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
          {!disabled && <Delete></Delete>}
        </Column>
        <BodyRow>
          {safeSettings.map((setting, index) => {
            const status = getConditionRowStatus(setting);
            const itemErrors = errors?.[index];

            // 필드별 에러 상태 결정: Zod 에러 또는 incomplete 상태에서 빈 필드만 에러
            const getFieldStatus = (
              field: keyof SettingItemErrors,
            ): "default" | "error" => {
              // Zod 검증 에러가 있으면 에러 표시
              if (itemErrors?.[field]) return "error";
              // incomplete 상태에서 해당 필드가 비어있으면 에러 표시
              if (status === "incomplete" && !setting[field]?.trim()) {
                return "error";
              }
              return "default";
            };

            return (
              <Column key={`${setting.item}-${index}`}>
                <Field>
                  <Dropdown
                    status={getFieldStatus("item")}
                    options={MONITORING_NOTIFICATION_TYPE_OPTIONS}
                    placeholder="항목 선택"
                    onChange={(value: string | null) =>
                      handleFieldChange(index, "item", value)
                    }
                    value={setting.item || null}
                    width="100%"
                    height={30}
                    disabled={disabled}
                  />
                </Field>
                <Field>
                  <Dropdown
                    status={getFieldStatus("operator")}
                    options={MONITORING_NOTIFICATION_OPERATOR_OPTIONS}
                    placeholder="연산자 선택"
                    onChange={(value: string | null) =>
                      handleFieldChange(index, "operator", value)
                    }
                    value={setting.operator || null}
                    width="100%"
                    height={30}
                    disabled={disabled}
                  />
                </Field>
                <Field>
                  <InputNumber
                    status={getFieldStatus("threshold")}
                    width="100%"
                    height={30}
                    min={1}
                    max={100}
                    suffix={MONITORING_NOTIFICATION_THRESHOLD_UNIT}
                    value={
                      setting.threshold === ""
                        ? undefined
                        : Number(setting.threshold)
                    }
                    onChange={(value) =>
                      handleFieldChange(index, "threshold", value)
                    }
                    autoComplete="off"
                    disabled={disabled}
                  />
                </Field>
                <Field>
                  <InputNumber
                    status={getFieldStatus("duration")}
                    width="100%"
                    height={30}
                    min={1}
                    suffix={MONITORING_NOTIFICATION_DURATION_UNIT}
                    value={
                      setting.duration === ""
                        ? undefined
                        : Number(setting.duration)
                    }
                    onChange={(value) =>
                      handleFieldChange(index, "duration", value)
                    }
                    autoComplete="off"
                    disabled={disabled}
                  />
                </Field>
                {!disabled && (
                  <Delete>
                    <Button
                      icon="Close"
                      iconSize={18}
                      onClick={() => handleDeleteSetting(index)}
                      disabled={safeSettings.length === 1}
                    />
                  </Delete>
                )}
              </Column>
            );
          })}
        </BodyRow>
      </Body>
    </div>
  );
}

// ===== Styled Components =====

/** 파라미터 입력 컨테이너
 * 테두리와 패딩을 가진 카드 형태의 레이아웃
 */
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

/**
 * 컬럼 헤더 제목 스타일
 * 파라미터 키/값 라벨의 스타일링
 */
const HeaderTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;

/**
 * 파라미터 행 레이아웃
 * 키, 값, 삭제 버튼을 가로로 배치
 */
const Column = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  border-radius: 4px;

  & > :first-child {
    flex: 1.5;    
  }

`;

/**
 * 입력 필드 컨테이너
 * flex: 1로 동일한 너비를 가지며 오버플로우를 처리
 */
const Field = styled.div`
  flex:  1;
  overflow: hidden;

`;

/**
 * 삭제 버튼 컨테이너
 * 오른쪽 정렬된 30px 너비의 삭제 버튼 영역
 */
const Delete = styled.div`
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
