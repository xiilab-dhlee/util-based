import { PAGE_META } from "@/shared/constants/page-meta.constant";

export const MONITORING_MENU_ICON = PAGE_META["admin.monitoring"]?.iconName;

/** 사용자 워크스페이스 모달 페이지 크기 */
export const USER_WORKSPACE_MODAL_PAGE_SIZE = 6;

/** 활성화 워크로드 목록 페이지 크기 */
export const ACTIVE_WORKLOAD_PAGE_SIZE = 20;

/** 모니터링 워크스페이스 목록 페이지 크기 */
export const MONITORING_WORKSPACE_PAGE_SIZE = 10;

/** 모니터링 사용자 리소스 목록 페이지 크기 */
export const MONITORING_USER_RESOURCE_PAGE_SIZE = 10;

/** 모니터링 워크스페이스 모달 페이지 크기 */
export const MONITORING_WORKSPACE_MODAL_PAGE_SIZE = 5;

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
