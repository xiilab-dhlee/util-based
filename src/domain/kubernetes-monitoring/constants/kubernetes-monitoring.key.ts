import type { KubernetesResourceName } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";

/**
 * Kubernetes 모니터링 관련 React Query 키
 *
 * - GET /api/v1/k8s/resources/{resourceName}
 *   query: pageNo, pageSize, keyword, status
 */
export const kubernetesMonitoringKeys = {
  default: ["kubernetesMonitoring"] as const,
  resourceList: (
    resourceName: KubernetesResourceName,
    pageNo: number,
    pageSize: number,
    keyword: string,
    status?: string,
  ) =>
    [
      ...kubernetesMonitoringKeys.default,
      "resourceList",
      resourceName,
      pageNo,
      pageSize,
      keyword,
      status,
    ] as const,
};
