import { HttpResponse, http } from "msw";

import {
  KUBERNETES_RESOURCE_FILTER_OPTIONS,
  KUBERNETES_RESOURCE_NAMES,
  KUBERNETES_RESOURCE_SEARCH_CONFIG,
  type KubernetesResourceName,
} from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { getResourceMocks } from "@/domain/kubernetes-monitoring/mocks/kubernetes-monitoring.mock";

/**
 * 리소스 타입별 검색 가능 필드 반환
 */
function getSearchableFields(resourceName: KubernetesResourceName): string[] {
  const config = KUBERNETES_RESOURCE_SEARCH_CONFIG[resourceName];
  return [config.searchKey];
}

/**
 * Kubernetes 모니터링 관련 API 핸들러
 *
 * - MSW_ENABLE=true 인 경우에만 활성화되며,
 *   kubernetes-monitoring 서비스에서 호출하는 엔드포인트를 모킹한다.
 */
export const kubernetesMonitoringHandlers = [
  // k8s 특정 리소스 목록 조회
  http.get<{ resourceName: string }>(
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
      const page = Number(url.searchParams.get("page") ?? "1");
      const size = Number(url.searchParams.get("size") ?? "20");
      const searchText = url.searchParams.get("searchText") ?? "";

      // 리소스별 필터 설정 가져오기
      const filterConfig = KUBERNETES_RESOURCE_FILTER_OPTIONS[resourceName];
      const filterValue = filterConfig.hasFilter
        ? url.searchParams.get(filterConfig.filterKey)
        : null;

      // 해당 리소스의 전체 Mock 데이터
      const allItems = getResourceMocks(resourceName);

      // 검색어 필터링 (리소스별 검색 가능 필드)
      const searchableFields = getSearchableFields(resourceName);
      const trimmedSearchText = searchText.trim().toLowerCase();
      const searchFiltered =
        trimmedSearchText.length > 0
          ? allItems.filter((item) =>
              searchableFields.some((field) =>
                String(item[field as keyof typeof item])
                  .toLowerCase()
                  .includes(trimmedSearchText),
              ),
            )
          : allItems;

      // 리소스별 필터 적용
      const filtered =
        filterValue && filterConfig.hasFilter
          ? searchFiltered.filter(
              (item) =>
                String(
                  item[filterConfig.filterKey as keyof typeof item],
                ).toLowerCase() === filterValue.toLowerCase(),
            )
          : searchFiltered;

      // 페이지네이션
      const startIndex = (page - 1) * size;
      const endIndex = startIndex + size;
      const paginatedItems = filtered.slice(startIndex, endIndex);

      const totalSize = filtered.length;

      return HttpResponse.json({
        totalSize,
        content: paginatedItems,
      });
    },
  ),
];
