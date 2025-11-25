/**
 * 페이지 메타데이터 정의
 * - ROUTES 상수를 참조하여 href 정의
 * - 아이콘은 MyIcon에서 사용하는 아이콘 이름 문자열(iconName)로 정의
 * - parent로 breadcrumb 계층 구조 표현
 *
 * 주의:
 * - 이 파일은 순수 상수 정의만 포함하고 React/JSX에 의존하지 않습니다.
 * - 실제 아이콘 렌더링은 사용처(레이아웃, Breadcrumb 헬퍼 등)에서
 *   `iconName`을 사용해 `<MyIcon name={iconName} />` 형태로 수행해야 합니다.
 */

import { ROUTES } from "./routes.constant";

/**
 * PAGE_META 정의
 * - 키: 페이지 키 (PageKey)
 * - 값: 페이지 메타 정보 (title, iconName, href, parent)
 */
export const PAGE_META = {
  // ============================================
  // Admin Routes - Monitoring
  // ============================================
  "admin.monitoring": {
    title: "모니터링",
    iconName: "Monitoring01",
    href: ROUTES.ADMIN_MONITORING,
  },
  "admin.kubernetes-monitoring": {
    title: "쿠버네티스 모니터링",
    iconName: "KubernetesMonitoring",
    href: ROUTES.ADMIN_KUBERNETES_MONITORING,
  },
  "admin.system-monitoring": {
    title: "시스템 모니터링",
    iconName: "SystemMonitoring",
    href: ROUTES.ADMIN_SYSTEM_MONITORING,
  },
  "admin.monitoring-notification": {
    title: "모니터링 알림",
    iconName: "Notification",
    href: ROUTES.ADMIN_MONITORING_NOTIFICATION,
  },

  // ============================================
  // Admin Routes - Node Management
  // ============================================
  "admin.node": {
    title: "노드 관리",
    iconName: "SingleNode",
    href: ROUTES.ADMIN_NODE,
  },
  "admin.node.detail": {
    title: "노드 정보",
    href: ({ name }: { name: string }) => ROUTES.ADMIN_NODE_DETAIL(name),
    parent: "admin.node",
  },
  "admin.node.log": {
    title: "노드 로그",
    href: ({ name }: { name: string }) => ROUTES.ADMIN_NODE_LOG(name),
    parent: "admin.node.detail",
  },
  "admin.node.redfish": {
    title: "Redfish",
    href: ({ name }: { name: string }) => ROUTES.ADMIN_NODE_REDFISH(name),
    parent: "admin.node.detail",
  },

  // ============================================
  // Admin Routes - Account Management
  // ============================================
  "admin.account-management": {
    title: "계정 관리",
    iconName: "Person",
    href: ROUTES.ADMIN_ACCOUNT_MANAGEMENT,
  },

  "admin.account-management.pending": {
    title: "승인 대기",
    href: ROUTES.ADMIN_ACCOUNT_MANAGEMENT_PENDING,
    parent: "admin.account-management",
  },
  "admin.account-management.group": {
    title: "그룹 관리",
    href: ROUTES.ADMIN_ACCOUNT_MANAGEMENT_GROUP,
    parent: "admin.account-management",
  },

  // ============================================
  // Admin Routes - Security
  // ============================================
  "admin.registry-security": {
    title: "레지스트리 보안",
    iconName: "SecurityCheck",
    href: ROUTES.ADMIN_REGISTRY_SECURITY,
  },
  "admin.file-security": {
    title: "파일 시스템 보안",
    iconName: "SecurityCheck",
    href: ROUTES.ADMIN_FILE_SECURITY,
  },

  // ============================================
  // Admin Routes - Workspace
  // ============================================
  "admin.workspace": {
    title: "워크스페이스 관리",
    iconName: "Workspace01",
    href: ROUTES.ADMIN_WORKSPACE,
  },
  "admin.workspace.detail": {
    title: "워크스페이스 상세",
    href: ({ id }: { id: string }) => ROUTES.ADMIN_WORKSPACE_DETAIL(id),
    parent: "admin.workspace",
  },
  "admin.workspace.member": {
    title: "멤버 관리",
    href: ({ id }: { id: string }) => ROUTES.ADMIN_WORKSPACE_MEMBER(id),
    parent: "admin.workspace.detail",
  },
  "admin.workspace.request-resource": {
    title: "리소스 신청 관리",
    iconName: "Resource",
    href: ROUTES.ADMIN_REQUEST_RESOURCE,
  },
  "admin.workspace.request-history": {
    title: "리소스 신청 이력",
    iconName: "Resource",
    href: ROUTES.ADMIN_REQUEST_RESOURCE_HISTORY,
  },
  "admin.workspace.workload.detail": {
    title: "워크로드 상세",
    href: ({ id }: { id: string }) =>
      ROUTES.ADMIN_WORKSPACE_WORKLOAD_DETAIL(id),
    parent: "admin.workspace",
  },
  "admin.workspace.workload.log": {
    title: "로그",
    href: ({ id }: { id: string }) => ROUTES.ADMIN_WORKSPACE_WORKLOAD_LOG(id),
    parent: "admin.workspace.workload.detail",
  },
  "admin.workspace.workload.file": {
    title: "파일",
    href: ({ id }: { id: string }) => ROUTES.ADMIN_WORKSPACE_WORKLOAD_FILE(id),
    parent: "admin.workspace.workload.detail",
  },
  "admin.workspace.workload.monitoring": {
    title: "모니터링",
    href: ({ id }: { id: string }) =>
      ROUTES.ADMIN_WORKSPACE_WORKLOAD_MONITORING(id),
    parent: "admin.workspace.workload.detail",
  },
  "admin.workspace.workload.security": {
    title: "보안",
    href: ({ id }: { id: string }) =>
      ROUTES.ADMIN_WORKSPACE_WORKLOAD_SECURITY(id),
    parent: "admin.workspace.workload.detail",
  },
  "admin.workspace.workload.terminal": {
    title: "터미널",
    href: ({ id }: { id: string }) =>
      ROUTES.ADMIN_WORKSPACE_WORKLOAD_TERMINAL(id),
    parent: "admin.workspace.workload.detail",
  },

  // ============================================
  // Admin Routes - Registry
  // ============================================
  "admin.registry": {
    title: "레지스트리 관리",
    iconName: "Image",
    href: ROUTES.ADMIN_REGISTRY,
  },
  "admin.internal-registry": {
    title: "내부 레지스트리",
    iconName: "InternalRegistry",
    href: ROUTES.ADMIN_INTERNAL_REGISTRY,
  },
  "admin.internal-registry.image": {
    title: "컨테이너 이미지 상세정보",
    href: ({ name, id }: { name: string; id: string }) =>
      ROUTES.ADMIN_INTERNAL_REGISTRY_IMAGE(name, id),
    parent: "admin.internal-registry",
  },
  "admin.request-image": {
    title: "이미지 사용 요청 관리",
    iconName: "ImageRequest",
    href: ROUTES.ADMIN_REQUEST_IMAGE,
  },
  "admin.external-registry": {
    title: "외부 레지스트리",
    iconName: "PublicRegistry",
    href: ROUTES.ADMIN_EXTERNAL_REGISTRY,
  },

  // ============================================
  // Admin Routes - Sourcecode Management
  // ============================================
  "admin.sourcecode-management": {
    title: "소스코드 관리",
    iconName: "SourceCode",
    href: ROUTES.ADMIN_SOURCECODE_MANAGEMENT,
  },

  // ============================================
  // Admin Routes - Volume Management
  // ============================================
  "admin.volume-management": {
    title: "볼륨 관리",
    iconName: "Volume",
    href: ROUTES.ADMIN_VOLUME_MANAGEMENT,
  },

  // ============================================
  // Admin Routes - Report
  // ============================================
  "admin.report": {
    title: "리포트",
    iconName: "Image",
    href: ROUTES.ADMIN_REPORT,
  },

  "admin.report-reservation": {
    title: "리포트 예약",
    iconName: "Image",
    href: ROUTES.ADMIN_REPORT_RESERVATION,
  },

  // ============================================
  // Admin Routes - Settings
  // ============================================
  "admin.setting": {
    title: "설정",
    iconName: "Setting01",
    href: ROUTES.ADMIN_SETTING,
  },
  "admin.notification": {
    title: "알림 설정",
    iconName: "Notification",
    href: ROUTES.ADMIN_NOTIFICATION,
  },

  // ============================================
  // User Routes - Monitoring
  // ============================================
  "user.monitoring": {
    title: "모니터링",
    iconName: "Monitoring01",
    href: ROUTES.USER_MONITORING,
  },

  // ============================================
  // User Routes - Workload
  // ============================================
  "user.workload": {
    title: "워크로드",
    iconName: "Workload",
    href: ROUTES.USER_WORKLOAD,
  },
  "user.workload.detail": {
    title: "워크로드 상세",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_DETAIL(id),
    parent: "user.workload",
  },
  "user.workload.log": {
    title: "로그",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_LOG(id),
    parent: "user.workload.detail",
  },
  "user.workload.file": {
    title: "파일",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_FILE(id),
    parent: "user.workload.detail",
  },
  "user.workload.monitoring": {
    title: "모니터링",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_MONITORING(id),
    parent: "user.workload.detail",
  },
  "user.workload.security": {
    title: "보안",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_SECURITY(id),
    parent: "user.workload.detail",
  },
  "user.workload.terminal": {
    title: "터미널",
    href: ({ id }: { id: string }) => ROUTES.USER_WORKLOAD_TERMINAL(id),
    parent: "user.workload.detail",
  },

  // ============================================
  // User Routes - Registry
  // ============================================
  "user.internal-registry-image": {
    title: "내부 레지스트리",
    iconName: "Image",
    href: ROUTES.USER_INTERNAL_REGISTRY_IMAGE,
  },
  "user.internal-registry-image.detail": {
    title: "컨테이너 이미지 상세정보",
    href: ({ id }: { id: string }) =>
      ROUTES.USER_INTERNAL_REGISTRY_IMAGE_DETAIL(id),
    parent: "user.internal-registry-image",
  },
  "user.internal-registry-image.tag": {
    title: "태그 상세정보",
    href: ({ id, tagId }: { id: string; tagId: string }) =>
      ROUTES.USER_INTERNAL_REGISTRY_IMAGE_TAG(id, tagId),
    parent: "user.internal-registry-image.detail",
  },

  // ============================================
  // User Routes - Sourcecode
  // ============================================
  "user.sourcecode": {
    title: "소스코드",
    iconName: "SourceCode",
    href: ROUTES.USER_SOURCECODE,
  },
  "user.sourcecode.detail": {
    title: "소스코드 상세",
    href: ({ id }: { id: string }) => ROUTES.USER_SOURCECODE_DETAIL(id),
    parent: "user.sourcecode",
  },

  // ============================================
  // User Routes - Volume
  // ============================================
  "user.volume": {
    title: "볼륨",
    iconName: "Volume",
    href: ROUTES.USER_VOLUME,
  },

  // ============================================
  // User Routes - Hub
  // ============================================
  "user.hub": {
    title: "허브",
    iconName: "Hub",
    href: ROUTES.USER_HUB,
  },

  // ============================================
  // User Routes - Setting
  // ============================================
  "user.setting": {
    title: "설정",
    iconName: "Setting01",
    href: ROUTES.USER_SETTING,
  },

  // ============================================
  // Common Settings (no href, 레이아웃 내부 설정 페이지)
  // ============================================
  "setting.profile": {
    title: "프로필 관리",
    iconName: "Profile",
  },
  "setting.alert": {
    title: "알림 설정",
    iconName: "Alert",
  },
  "setting.member": {
    title: "멤버 관리",
    iconName: "Member",
  },
} as const;

/**
 * 페이지 키 타입 (자동 추론)
 */
export type PageKey = keyof typeof PAGE_META;

/**
 * Breadcrumb 아이템 메타 정보
 * - PAGE_META의 value 타입을 기반으로 하는 레퍼런스 타입
 */
export interface PageItemMeta {
  /** 페이지 제목 */
  title: string;
  /** 페이지 아이콘 이름 (MyIcon에서 사용하는 아이콘 키) */
  iconName?: string;
  /** 페이지 경로 (정적) 또는 경로 생성 함수 (동적) */
  href?: string | ((params: Record<string, string>) => string);
  /** 부모 페이지 키 (breadcrumb 계층 구조) */
  parent?: PageKey;
}
