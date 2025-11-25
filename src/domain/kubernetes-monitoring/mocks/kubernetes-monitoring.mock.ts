import type { KubernetesResourceName } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import type {
  KubernetesResourceItem,
  KubernetesResourceListResponse,
} from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";

export function generateMockKubernetesResourceList(
  resourceName: KubernetesResourceName,
  pageNo: number,
  pageSize: number,
  keyword: string,
  status?: string | null,
): KubernetesResourceListResponse {
  const currentPage = pageNo;

  const baseIndex = (pageNo - 1) * pageSize;

  const allItems: KubernetesResourceItem[] = Array.from({
    length: pageSize,
  }).map((_, index) => {
    const seq = baseIndex + index + 1;

    const status =
      seq % 3 === 0 ? "Running" : seq % 3 === 1 ? "Pending" : "Failed";

    return {
      resourceName,
      namespace: `namespace-${seq}`,
      status,
      createDateTime: new Date(Date.now() - seq * 60 * 60 * 1000).toISOString(),
    };
  });

  const trimmedKeyword = keyword.trim();
  const trimmedStatus = status?.trim() ?? "";

  const filteredByKeyword =
    trimmedKeyword.length > 0
      ? allItems.filter(
          (item) =>
            item.namespace.includes(trimmedKeyword) ||
            item.status.includes(trimmedKeyword),
        )
      : allItems;

  const items =
    trimmedStatus.length > 0
      ? filteredByKeyword.filter((item) => item.status === trimmedStatus)
      : filteredByKeyword;
  const totalSize = items.length;
  const totalPageNum = Math.ceil(totalSize / pageSize);
  return {
    totalSize,
    totalPageNum,
    currentPage,
    content: items,
  };
}
