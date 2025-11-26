"use client";

import { useQuery } from "@tanstack/react-query";

import { kubernetesMonitoringService } from "@/domain/kubernetes-monitoring/api/kubernetes-monitoring.service";
import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { kubernetesMonitoringKeys } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.key";
import type { KubernetesResourceListResponse } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

interface UseKubernetesResourceListParams {
  resourceName: KubernetesResourceName | null;
  pageNo: number;
  pageSize: number;
  keyword?: string;
  status?: string | null;
}

/**
 * k8s 특정 리소스 목록 조회 훅
 *
 * - GET /api/v1/k8s/resources/{resourceName}
 * - query: pageNo, pageSize, keyword, status
 */
export function useKubernetesResourceList({
  resourceName,
  pageNo,
  pageSize,
  keyword = "",
  status,
}: UseKubernetesResourceListParams) {
  const isEnabled = Boolean(resourceName);
  const safeResourceName = resourceName ?? KUBERNETES_RESOURCE_NAMES[0];

  return useQuery<{ data: KubernetesResourceListResponse }>({
    queryKey: kubernetesMonitoringKeys.resourceList(
      safeResourceName,
      pageNo,
      pageSize,
      keyword,
      status ?? undefined,
    ),
    queryFn: () =>
      kubernetesMonitoringService.getKubernetesResourceList(safeResourceName, {
        pageNo,
        pageSize,
        keyword,
        status: status ?? undefined,
      }),
    enabled: isEnabled,
  });
}
