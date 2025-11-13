import type { CoreNavMenu } from "@/types/common/core.model";

const STANDARD_NAV_MENU: CoreNavMenu[] = [
  {
    title: "Entire",
    items: [
      {
        key: "dashboard",
        label: "대시보드",
        icon: "Dashboard",
      },
      {
        type: "divider",
      },
    ],
  },
  {
    title: "WORK",
    items: [
      {
        key: "workload",
        label: "워크로드",
        icon: "Workload",
      },
      // {
      //   key: "compare",
      //   label: "비교실험",
      //   icon: "ComparativeExperiment",
      // },
      {
        key: "private-registry",
        label: "내부 레지스트리",
        icon: "Image",
      },
      // {
      //   key: "public-registry",
      //   label: "외부 레지스트리",
      //   icon: "PublicRegistry",
      // },
      {
        key: "sourcecode",
        label: "소스코드",
        icon: "SourceCode",
      },
      {
        key: "volume",
        label: "볼륨",
        icon: "Volume",
      },
      // {
      //   key: "model",
      //   label: "모델관리",
      //   icon: "Model",
      // },
      // {
      //   key: "service",
      //   label: "서비스",
      //   icon: "Service",
      // },
      {
        key: "hub",
        icon: "Hub",
        label: "허브",
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting",
        label: "설정",
        icon: "Setting01",
      },
    ],
  },
];

const ADMIN_NAV_MENU: CoreNavMenu[] = [
  // {
  //   title: "Entire",
  //   items: [
  //     {
  //       key: "dashboard",
  //       label: "대시보드",
  //       icon: "Dashboard",
  //     },
  //     {
  //       type: "divider",
  //     },
  //   ],
  // },
  {
    title: "Menu",
    items: [
      {
        key: "monitoring-root",
        label: "모니터링",
        icon: "Monitoring01",
        children: [
          { key: "monitoring", label: "모니터링 메인" },
          // { key: "security-monitoring", label: "보안 모니터링" },
          { key: "system-monitoring", label: "시스템 모니터링" },
          { key: "cluster-monitoring", label: "클러스터 모니터링" },
          { key: "monitoring-notification", label: "모니터링 알림" },
        ],
      },
      {
        key: "node",
        label: "노드 관리",
        icon: "SingleNode",
      },
      // {
      //   key: "schedule",
      //   label: "스케쥴링 큐 관리",
      //   icon: "Calendar",
      // },
      {
        key: "security-root",
        label: "보안 관리",
        icon: "SecurityCheck",
        children: [
          { key: "registry-security", label: "레지스트리 보안" },
          { key: "file-security", label: "파일 시스템 보안" },
        ],
      },
      {
        key: "workspace",
        label: "워크스페이스 관리",
        icon: "Workspace01",
      },
      {
        key: "registry-root",
        label: "레지스트리",
        icon: "Image",
        children: [
          { key: "registry", label: "레지스트리 메인" },
          { key: "request-image", label: "이미지 사용 요청 관리" },
          { key: "private-registry", label: "내부 레지스트리" },
          // { key: "registry-public", label: "외부 레지스트리" },
        ],
      },
      {
        key: "report",
        label: "리포트",
        icon: "Image",
      },
    ],
  },
  {
    title: "Setting",
    items: [
      {
        key: "setting-root",
        label: "설정",
        icon: "Setting01",
        children: [
          { key: "user", label: "계정 관리" },
          { key: "alert", label: "알림 관리" },
        ],
      },
    ],
  },
];

const layoutConstants = {
  standardNavMenus: STANDARD_NAV_MENU,
  adminNavMenus: ADMIN_NAV_MENU,
  navIconSize: 20,
  navIconColor: "var(--menu-icon-color)",
};

export default layoutConstants;
