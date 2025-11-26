import { HttpResponse, http } from "msw";

import {
  KUBERNETES_RESOURCE_NAMES,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { generateMockKubernetesResourceList } from "@/domain/kubernetes-monitoring/mocks/kubernetes-monitoring.mock";
import type { KubernetesResourceListResponse } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

/**
 * Kubernetes 모니터링 관련 API 핸들러
 *
 * - MSW_ENABLE=true 인 경우에만 활성화되며,
 *   kubernetes-monitoring 서비스에서 호출하는 엔드포인트를 모킹한다.
 */
export const kubernetesMonitoringHandlers = [
  // k8s 특정 리소스 목록 조회
  http.get<{ resourceName: string }, never, KubernetesResourceListResponse>(
    "/api/v1/k8s/resources/:resourceName",
    ({ params, request }) => {
      const resourceNameParam = params.resourceName;

      const resourceName = KUBERNETES_RESOURCE_NAMES.find(
        (name) => name.toLowerCase() === resourceNameParam.toLowerCase(),
      ) as KubernetesResourceName | undefined;

      if (!resourceName) {
        return HttpResponse.json(null, { status: 400 });
      }

      const url = new URL(request.url);
      const pageNo = Number(url.searchParams.get("pageNo") ?? "1");
      const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
      const keyword = url.searchParams.get("keyword") ?? "";
      const status = url.searchParams.get("status");

      const data = generateMockKubernetesResourceList(
        resourceName,
        pageNo,
        pageSize,
        keyword,
        status,
      );

      return HttpResponse.json<KubernetesResourceListResponse>(data);
    },
  ),
];
