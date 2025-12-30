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
