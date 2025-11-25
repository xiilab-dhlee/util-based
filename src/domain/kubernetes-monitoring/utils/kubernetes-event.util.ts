import { format, isValid, parseISO } from "date-fns";
import type { LabelColorVariant } from "xiilab-ui/dist/components/Label/types";

import {
  KUBERNETES_EVENT_STATUS,
  KUBERNETES_EVENT_STATUS_LABEL,
  type KubernetesEventStatus,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

const KUBERNETES_EVENT_STATUS_LABEL_VARIANT_MAP: Record<
  KubernetesEventStatus,
  LabelColorVariant
> = {
  [KUBERNETES_EVENT_STATUS.ERROR]: "red",
  [KUBERNETES_EVENT_STATUS.WARNING]: "orange",
  [KUBERNETES_EVENT_STATUS.NORMAL]: "green",
};

/**
 * Kubernetes 이벤트 상태 코드에 따른
 * - 한글 라벨 텍스트
 * - xiilab-ui Label variant
 * 를 함께 반환하는 유틸리티
 */
export function getKubernetesEventLabelProps(status: string): {
  label: string;
  variant: LabelColorVariant;
} {
  const typedStatus = status as KubernetesEventStatus;

  return {
    label: KUBERNETES_EVENT_STATUS_LABEL[typedStatus] ?? status,
    variant: KUBERNETES_EVENT_STATUS_LABEL_VARIANT_MAP[typedStatus] ?? "blue",
  };
}

/**
 * dateTime 문자열을 카드 표시용 날짜/시간으로 파싱
 * @param dateTime - ISO 형식 문자열 (예: "2024-12-26T13:31:00")
 * @returns { date: "24.12.26", time: "13:31" }
 */
export function getParseDateTime(dateTime: string): {
  date: string;
  time: string;
} {
  try {
    const dateObj = parseISO(dateTime);

    if (!isValid(dateObj)) {
      return { date: "-", time: "-" };
    }

    const date = format(dateObj, "yy.MM.dd");
    const time = format(dateObj, "HH:mm");

    return { date, time };
  } catch {
    return { date: "-", time: "-" };
  }
}
