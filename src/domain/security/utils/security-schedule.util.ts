import type {
  SecuritySchedulePeriodUnit,
  SecurityUsageStatus,
  SecurityWeekDayKey,
} from "@/shared/constants/security.constant";
import {
  SECURITY_SCHEDULE_PERIOD_UNIT_WEEK,
  SECURITY_SCHEDULE_PERIOD_UNITS,
  SECURITY_USAGE_DISABLED,
  SECURITY_USAGE_ENABLED,
  SECURITY_WEEK_DAYS,
} from "@/shared/constants/security.constant";
import { formatDateSafely } from "@/shared/utils/date.util";

interface SecurityScheduleDescriptionParams {
  scheduleUsage: SecurityUsageStatus;
  periodValue: number;
  periodUnit: SecuritySchedulePeriodUnit;
  weekDays: SecurityWeekDayKey[];
  startDateTime: Date;
  endDateUsage: SecurityUsageStatus;
  endDateTime: Date | null;
}

const WEEK_DAY_LABEL_MAP: Record<SecurityWeekDayKey, string> =
  SECURITY_WEEK_DAYS.reduce(
    (acc, day) => {
      acc[day.key] = day.label;
      return acc;
    },
    {} as Record<SecurityWeekDayKey, string>,
  );

const PERIOD_UNIT_LABEL_MAP: Record<SecuritySchedulePeriodUnit, string> =
  SECURITY_SCHEDULE_PERIOD_UNITS.reduce(
    (acc, unit) => {
      acc[unit.key] = unit.label;
      return acc;
    },
    {} as Record<SecuritySchedulePeriodUnit, string>,
  );

export function createSecurityScheduleDescription(
  params: SecurityScheduleDescriptionParams,
): string {
  const {
    scheduleUsage,
    periodValue,
    periodUnit,
    weekDays,
    startDateTime,
    endDateUsage,
    endDateTime,
  } = params;

  if (scheduleUsage === SECURITY_USAGE_DISABLED) {
    return "-";
  }

  if (!Number.isFinite(periodValue) || periodValue <= 0) {
    return "-";
  }

  const periodUnitLabel = PERIOD_UNIT_LABEL_MAP[periodUnit];
  const timeLabel = formatDateSafely(startDateTime, "HH:mm", "-");

  const hasEndDate = endDateUsage === SECURITY_USAGE_ENABLED && !!endDateTime;
  const endDateLabel = hasEndDate
    ? formatDateSafely(endDateTime, "yyyy.MM.dd", "-")
    : null;

  const weekDayLabel =
    periodUnit === SECURITY_SCHEDULE_PERIOD_UNIT_WEEK && weekDays.length > 0
      ? weekDays.map((key) => WEEK_DAY_LABEL_MAP[key]).join(",")
      : null;

  const base = `매 ${periodValue}${periodUnitLabel}마다`;

  if (!timeLabel || timeLabel === "-") {
    // 시간 정보를 신뢰할 수 없는 경우, 시간/요일 없이 주기만 노출
    if (endDateLabel) {
      return `${base}, ${endDateLabel}까지 보안 검사 진행`;
    }
    return `${base} 보안 검사 진행`;
  }

  if (endDateLabel) {
    if (weekDayLabel) {
      return `${base}, ${endDateLabel}까지 ${weekDayLabel} ${timeLabel} 보안 검사 진행`;
    }
    return `${base}, ${endDateLabel}까지 ${timeLabel} 보안 검사 진행`;
  }

  if (weekDayLabel) {
    return `${base}, ${weekDayLabel} ${timeLabel} 보안 검사 진행`;
  }

  return `${base}, ${timeLabel} 보안 검사 진행`;
}
