import { useState } from "react";
import type { z } from "zod";

import { EMPTY_NOTIFICATION_SETTING } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  type MonitoringNotificationFormType,
  type MonitoringNotificationListResponseType,
  type MonitoringNotificationRequestPayload,
  type MonitoringNotificationSettingFormType,
  monitoringNotificationRequestSchema,
} from "@/domain/monitoring-notification/schemas/monitoring-notification.schema";
import type { MonitoringNotificationFormErrors } from "@/domain/monitoring-notification/types/monitoring-notification.type";

// ===== 상수 =====

const INITIAL_FORM_STATE: MonitoringNotificationFormType = {
  name: "",
  nodeName: "",
  isEmail: true, // 기본값: E-mail 선택
  isSystem: false,
  settings: [EMPTY_NOTIFICATION_SETTING],
};

// ===== 타입 =====

interface UseMonitoringNotificationFormReturn {
  // 상태
  formState: MonitoringNotificationFormType;
  errors: MonitoringNotificationFormErrors;

  // 필드 변경
  setField: <Key extends keyof MonitoringNotificationFormType>(
    field: Key,
    value: MonitoringNotificationFormType[Key],
  ) => void;

  // settings 배열 조작
  addSetting: () => void;
  removeSetting: (index: number) => void;
  updateSetting: (
    index: number,
    field: keyof MonitoringNotificationSettingFormType,
    value: string,
  ) => void;
  setSettings: (settings: MonitoringNotificationSettingFormType[]) => void;

  // 폼 제어
  /** 검증 후 성공 시 payload 반환, 실패 시 null 반환 */
  validate: () => MonitoringNotificationRequestPayload | null;
  reset: () => void;
  initializeForEdit: (data: MonitoringNotificationListResponseType) => void;
  initializeForCreate: () => void;
}

// ===== 유틸 함수 =====

/**
 * Zod 에러를 폼 에러 구조로 매핑
 */
function mapZodErrors(error: z.ZodError): MonitoringNotificationFormErrors {
  const errors: MonitoringNotificationFormErrors = {};

  for (const issue of error.issues) {
    const path = issue.path;

    if (path.length === 0) {
      // refine 에러 (채널 선택 검증)
      errors.channel = issue.message;
    } else if (path[0] === "settings") {
      if (path.length === 1) {
        // settings 배열 전체 에러
        errors.settings = issue.message;
      } else {
        // settings[index].field 에러
        const index = path[1] as number;
        const field = path[2] as string;
        errors.settingsItems = errors.settingsItems || [];
        errors.settingsItems[index] = errors.settingsItems[index] || {};
        (errors.settingsItems[index] as Record<string, string>)[field] =
          issue.message;
      }
    } else {
      // 일반 필드 에러
      const fieldName = path[0] as keyof MonitoringNotificationFormErrors;
      (errors as Record<string, string>)[fieldName] = issue.message;
    }
  }

  return errors;
}

/**
 * 완전한 settings 항목만 필터링 (빈 항목 제거)
 * - 단, 모든 항목이 빈 경우 첫 번째 항목은 유지 (검증 에러 표시용)
 */
function filterCompleteSettings(
  settings: MonitoringNotificationSettingFormType[],
): MonitoringNotificationSettingFormType[] {
  const complete = settings.filter(
    (s) => s.item && s.operator && s.threshold && s.duration,
  );

  // 완전한 항목이 없으면 첫 번째 항목 유지 (빈 필드 에러 표시용)
  if (complete.length === 0 && settings.length > 0) {
    return [settings[0]];
  }

  return complete;
}

/**
 * 서버 응답 데이터를 폼 상태로 변환
 */
function responseToFormState(
  data: MonitoringNotificationListResponseType,
): MonitoringNotificationFormType {
  return {
    name: data.name,
    nodeName: data.nodeName,
    isEmail: data.isEmail,
    isSystem: data.isSystem,
    settings: data.settings.map((s) => ({
      item: s.item,
      operator: s.operator,
      threshold: String(s.threshold),
      duration: String(s.duration),
    })),
  };
}

// ===== 훅 =====

/**
 * 모니터링 알림 폼 상태 및 검증 훅
 * - 순수 폼 상태 관리 + Zod 검증만 담당
 */
export function useMonitoringNotificationForm(): UseMonitoringNotificationFormReturn {
  // 폼 상태
  const [formState, setFormState] =
    useState<MonitoringNotificationFormType>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<MonitoringNotificationFormErrors>({});

  // ===== 필드 변경 =====

  const setField = <Key extends keyof MonitoringNotificationFormType>(
    field: Key,
    value: MonitoringNotificationFormType[Key],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // 해당 필드 에러 클리어
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // ===== settings 배열 조작 =====

  const addSetting = () => {
    setFormState((prev) => ({
      ...prev,
      settings: [...prev.settings, EMPTY_NOTIFICATION_SETTING],
    }));
  };

  const removeSetting = (index: number) => {
    setFormState((prev) => {
      if (prev.settings.length <= 1) return prev;
      return {
        ...prev,
        settings: prev.settings.filter((_, i) => i !== index),
      };
    });
    // 해당 인덱스 에러 제거
    if (errors.settingsItems?.[index]) {
      setErrors((prev) => {
        const newItems = [...(prev.settingsItems || [])];
        newItems.splice(index, 1);
        return { ...prev, settingsItems: newItems };
      });
    }
  };

  const updateSetting = (
    index: number,
    field: keyof MonitoringNotificationSettingFormType,
    value: string,
  ) => {
    setFormState((prev) => {
      const newSettings = [...prev.settings];
      newSettings[index] = { ...newSettings[index], [field]: value };
      return { ...prev, settings: newSettings };
    });
    // 해당 필드 에러 클리어
    if (errors.settingsItems?.[index]?.[field]) {
      setErrors((prev) => {
        const newItems = [...(prev.settingsItems || [])];
        if (newItems[index]) {
          newItems[index] = { ...newItems[index], [field]: undefined };
        }
        return { ...prev, settingsItems: newItems };
      });
    }
  };

  const setSettings = (settings: MonitoringNotificationSettingFormType[]) => {
    setFormState((prev) => ({ ...prev, settings }));
    // settings 변경 시 settingsItems 에러 클리어
    if (errors.settingsItems) {
      setErrors((prev) => ({ ...prev, settingsItems: undefined }));
    }
  };

  // ===== 폼 제어 =====

  /**
   * 폼 검증 - 성공 시 변환된 payload 반환, 실패 시 null 반환
   */
  const validate = (): MonitoringNotificationRequestPayload | null => {
    // 1. 완전한 settings만 필터링 (UI는 빈 항목도 보여주지만, 제출 시 제거)
    const filteredSettings = filterCompleteSettings(formState.settings);
    const dataToValidate = { ...formState, settings: filteredSettings };

    // 2. Zod 검증
    const result =
      monitoringNotificationRequestSchema.safeParse(dataToValidate);

    if (!result.success) {
      const mappedErrors = mapZodErrors(result.error);
      setErrors(mappedErrors);
      return null;
    }

    // 3. 에러 클리어 및 검증된 payload 반환
    setErrors({});
    return result.data;
  };

  const reset = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  const initializeForEdit = (data: MonitoringNotificationListResponseType) => {
    setFormState(responseToFormState(data));
    setErrors({});
  };

  const initializeForCreate = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  return {
    // 상태
    formState,
    errors,

    // 필드 변경
    setField,

    // settings 배열 조작
    addSetting,
    removeSetting,
    updateSetting,
    setSettings,

    // 폼 제어
    validate,
    reset,
    initializeForEdit,
    initializeForCreate,
  };
}
