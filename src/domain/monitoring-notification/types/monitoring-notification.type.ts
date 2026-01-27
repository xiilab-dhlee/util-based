import type { Control, FieldErrors } from "react-hook-form";

import type { NotificationFormType } from "@/domain/monitoring-notification/utils/monitoring-notification.override.zod";
import type { ModalMode } from "@/shared/constants/core.constant";

// ===== 폼 섹션 Props 타입 =====

export interface NotificationChannelSectionProps {
  control: Control<NotificationFormType>;
  errors: FieldErrors<NotificationFormType>;
  disabled?: boolean;
}

export interface NotificationInfoSectionProps {
  control: Control<NotificationFormType>;
  errors: FieldErrors<NotificationFormType>;
  nodeOptions: { label: string; value: string }[];
  isNodeNamesLoading?: boolean;
  disabled?: boolean;
}

export interface NotificationSettingsSectionProps {
  control: Control<NotificationFormType>;
  errors: FieldErrors<NotificationFormType>;
  disabled?: boolean;
  isGpuMetricDisabled?: boolean;
  hasGpuMetricError?: boolean;
}

export interface ThresholdFieldError {
  metric?: string;
  operator?: string;
  value?: string;
  durationMinutes?: string;
}

// ===== 모달 관련 타입 =====

/**
 * 모니터링 알림 모달 모드
 */
export type NotificationModalMode = ModalMode;
