import { PAGE_META } from "@/shared/constants/page-meta";

export const MONITORING_MENU_ICON = PAGE_META["admin.monitoring"]?.iconName;
export const MONITORING_QUICK_MENUS = [
  {
    title: "시스템 모니터링",
    titleEng: "System Monitoring",
    icon: "SystemMonitoring",
    iconSize: 32,
    href: "/admin/system-monitoring",
  },
  {
    title: "클러스터 모니터링",
    titleEng: "Cluster Monitoring",
    icon: "CirclesExt",
    iconSize: 32,
    href: "/admin/cluster-monitoring",
  },
  {
    title: "모니터링 알림",
    titleEng: "Monitoring Notification",
    icon: "Alarm",
    iconSize: 32,
    href: "/admin/monitoring-notification",
  },
];
