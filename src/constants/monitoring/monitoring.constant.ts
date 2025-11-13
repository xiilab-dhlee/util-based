import type { CoreResourceType } from "@/types/common/core.interface";

const QUICK_MENUS = [
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

const RESOURCES = [
  {
    label: "GPU" as CoreResourceType,
    unit: "개",
    total: 100,
    usage: 45,
    request: 35,
  },
  {
    label: "CPU" as CoreResourceType,
    unit: "Core",
    total: 100,
    usage: 45,
    request: 35,
  },
  {
    label: "MEM" as CoreResourceType,
    unit: "GB",
    total: 100,
    usage: 45,
    request: 35,
  },
  {
    label: "DISK" as CoreResourceType,
    unit: "TB",
    total: 100,
    usage: 45,
    request: 35,
  },
];

const monitoringConstants = {
  quickMenus: QUICK_MENUS,
  resources: RESOURCES,
};

export default monitoringConstants;
