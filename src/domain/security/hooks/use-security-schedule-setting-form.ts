import { useState } from "react";
import { z } from "zod";

import type {
  SecuritySchedulePeriodUnit,
  SecurityUsageStatus,
  SecurityWeekDayKey,
} from "@/shared/constants/security.constant";
import {
  SECURITY_SCHEDULE_PERIOD_UNIT_DAY,
  SECURITY_SCHEDULE_PERIOD_UNIT_WEEK,
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_ENABLED,
} from "@/shared/constants/security.constant";

const securityScheduleSettingSchema = z
  .object({
    scheduleUsage: z.custom<SecurityUsageStatus>(),
    startDateTime: z.date(),
    endDateUsage: z.custom<SecurityUsageStatus>(),
    endDateTime: z.date().optional().nullable(),
    periodValue: z.number().int().min(1),
    periodUnit: z.custom<SecuritySchedulePeriodUnit>(),
    weekDays: z.array(z.custom<SecurityWeekDayKey>()),
  })
  .refine(
    (value) =>
      value.scheduleUsage === SECURITY_USAGE_DISABLED ||
      value.periodUnit !== SECURITY_SCHEDULE_PERIOD_UNIT_WEEK ||
      value.weekDays?.length,
    {
      path: ["weekDays"],
      message: "검사 요일을 한 개 이상 선택해 주세요.",
    },
  )
  .refine(
    (value) =>
      value.periodUnit !== SECURITY_SCHEDULE_PERIOD_UNIT_DAY ||
      (typeof value.periodValue === "number" && value.periodValue <= 31),
    {
      path: ["periodValue"],
      message: "일 단위 주기는 1일부터 31일 사이로 설정할 수 있습니다.",
    },
  )
  .refine(
    (value) =>
      value.endDateUsage !== SECURITY_USAGE_ENABLED || value.endDateTime,
    {
      path: ["endDateTime"],
      message: "종료 날짜를 선택해 주세요.",
    },
  );

export type SecurityScheduleSettingFormValue = z.infer<
  typeof securityScheduleSettingSchema
>;

interface SecurityScheduleSettingErrors {
  scheduleUsage?: string;
  startDateTime?: string;
  endDateUsage?: string;
  endDateTime?: string;
  periodValue?: string;
  periodUnit?: string;
  weekDays?: string;
}

interface UseSecurityScheduleSettingFormResult {
  formState: SecurityScheduleSettingFormValue;
  errors: SecurityScheduleSettingErrors;
  setField: <K extends keyof SecurityScheduleSettingFormValue>(
    key: K,
    value: SecurityScheduleSettingFormValue[K],
  ) => void;
  validate: () => SecurityScheduleSettingFormValue | null;
}

const DEFAULT_FORM_VALUE: SecurityScheduleSettingFormValue = {
  scheduleUsage: SECURITY_USAGE_ENABLED,
  startDateTime: new Date(),
  endDateUsage: SECURITY_USAGE_DISABLED,
  endDateTime: null,
  periodValue: 2,
  periodUnit: SECURITY_SCHEDULE_PERIOD_UNIT_DAY,
  weekDays: [],
};

export function useSecurityScheduleSettingForm(): UseSecurityScheduleSettingFormResult {
  const [formState, setFormState] =
    useState<SecurityScheduleSettingFormValue>(DEFAULT_FORM_VALUE);
  const [errors, setErrors] = useState<SecurityScheduleSettingErrors>({});

  const setField = <K extends keyof SecurityScheduleSettingFormValue>(
    key: K,
    value: SecurityScheduleSettingFormValue[K],
  ) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    const safeState = {
      ...formState,
      endDateTime:
        formState.endDateUsage === SECURITY_USAGE_ENABLED
          ? formState.endDateTime
          : null,
    };

    const result = securityScheduleSettingSchema.safeParse(safeState);

    if (!result.success) {
      const fieldErrors: SecurityScheduleSettingErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SecurityScheduleSettingErrors;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  return {
    formState,
    errors,
    setField,
    validate,
  };
}
