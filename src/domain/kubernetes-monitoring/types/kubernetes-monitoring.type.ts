import type { KubernetesResourceName } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

export interface KubernetesResourceItem {
  resourceName: KubernetesResourceName;
  namespace: string;
  status: string;
  createDateTime: string;
}

export interface KubernetesResourceListResponse {
  totalSize: number;
  totalPageNum: number;
  currentPage: number;
  content: KubernetesResourceItem[];
}

/**
 * 쿠버네티스 이벤트 타입
 * 이벤트 카드 및 상세 모달에서 사용
 */
export interface KubernetesEventType {
  eventId: string;
  namespace: string;
  status: string;
  object: string;
  ipAddress: string;
  message: string;
  dateTime: string;
}
