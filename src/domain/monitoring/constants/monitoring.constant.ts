import type { ClusterResourceData } from "@/domain/monitoring/components/monitoring-cluster-resource";
import { PAGE_META } from "@/shared/constants/page-meta.constant";
import type { CoreResourceType } from "@/shared/types/core.interface";
import type { TableSortState } from "@/shared/types/core.model";

/** 워크스페이스 기본 정렬: 생성일 내림차순 */
export const DEFAULT_WORKSPACE_SORT: TableSortState = {
  sortBy: "creatorDate",
  sortDirection: "DESC",
};

/** 사용자 리소스 기본 정렬: 사용자 오름차순 */
export const DEFAULT_USER_RESOURCE_SORT: TableSortState = {
  sortBy: "userName",
  sortDirection: "ASC",
};

/** 활성화 워크로드 기본 정렬: 워크로드 이름 오름차순 */
export const DEFAULT_ACTIVE_WORKLOAD_SORT: TableSortState = {
  sortBy: "workloadName",
  sortDirection: "ASC",
};

export const MONITORING_MENU_ICON = PAGE_META["admin.monitoring"]?.iconName;

/** 사용자 워크스페이스 모달 페이지 크기 */
export const USER_WORKSPACE_MODAL_PAGE_SIZE = 6;

/** 활성화 워크로드 목록 페이지 크기 */
export const ACTIVE_WORKLOAD_PAGE_SIZE = 20;

/** 클러스터 리소스 더미 데이터 (리소스 타입별) */
export const CLUSTER_RESOURCE_DUMMY_DATA: Record<
  CoreResourceType,
  ClusterResourceData
> = {
  GPU: { total: 999, requested: 666, used: 333 },
  GPU_MEMORY: { total: 999, requested: 666, used: 333 },
  MIG: { total: 999, requested: 666, used: 333 },
  MPS: { total: 999, requested: 666, used: 333 },
  CPU: { total: 999, requested: 666, used: 333 },
  MEM: { total: 999, requested: 666, used: 333 },
  DISK: { total: 999, requested: 666, used: 333 },
};

export const MONITORING_QUICK_MENUS = [
  {
    title: PAGE_META["admin.system-monitoring"].title,
    icon: PAGE_META["admin.system-monitoring"].iconName,
    iconSize: 32,
    href: PAGE_META["admin.system-monitoring"].href,
  },
  {
    title: PAGE_META["admin.kubernetes-monitoring"].title,
    icon: PAGE_META["admin.kubernetes-monitoring"].iconName,
    iconSize: 32,
    href: PAGE_META["admin.kubernetes-monitoring"].href,
  },
  {
    title: PAGE_META["admin.monitoring-notification"].title,
    icon: PAGE_META["admin.monitoring-notification"].iconName,
    iconSize: 32,
    href: PAGE_META["admin.monitoring-notification"].href,
  },
];
