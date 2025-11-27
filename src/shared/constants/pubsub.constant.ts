/**
 * PubSub 이벤트 상수 정의
 * 워크로드 관련 이벤트들을 중앙에서 관리합니다.
 */

// 워크스페이스 관련 이벤트
export const WORKSPACE_EVENTS = {
  // 워크스페이스 수정에 필요한 정보 전달 이벤트
  sendUpdateWorkspace: "workspace:send-update-workspace",
  // 워크스페이스 삭제에 필요한 정보 전달 이벤트
  sendDeleteWorkspace: "workspace:send-delete-workspace",
  // 워크스페이스 멤버 계정 정보 수정에 필요한 정보 전달 이벤트
  sendUpdateWorkspaceMember: "workspace:send-update-workspace-member",
  // 워크스페이스 멤버 삭제에 필요한 정보 전달 이벤트
  sendDeleteWorkspaceMember: "workspace:send-delete-workspace-member",
  // 워크스페이스 리소스 요청 사유 모달에 필요한 정보 전달 이벤트
  sendRequestReason: "workspace:send-request-reason",
  // 워크스페이스 리소스 요청 반려 사유 모달에 필요한 정보 전달 이벤트
  sendRejectReason: "workspace:send-reject-reason",
  // 워크스페이스 리소스 승인 모달에 필요한 정보 전달 이벤트
  sendApproveResource: "workspace:send-approve-resource",
  // 워크스페이스 리소스 반려에 필요한 정보 전달 이벤트
  sendRejectResource: "workspace:send-reject-resource",
} as const;

// 워크로드 관련 이벤트
export const WORKLOAD_EVENTS = {
  // 워크로드 수정에 필요한 정보 전달 이벤트
  sendUpdateWorkload: "workload:send-update-workload",
  // 커밋 이미지 생성에 필요한 정보 전달 이벤트
  sendCommitImage: "workload:send-commit-image",
  // 워크로드 모니터링에 필요한 정보 전달 이벤트
  sendWorkloadMonitoring: "workload:send-workload-monitoring",
  // 워크로드 복제 시 필요한 정보 전달 이벤트
  sendCloneWorkload: "workload:send-clone-workload",
} as const;

// 소스코드 관련 이벤트
export const SOURCECODE_EVENTS = {
  // 소스코드 삭제에 필요한 정보 전달 이벤트
  sendDeleteSourcecode: "sourcecode:send-delete-sourcecode",
} as const;

// 볼륨 관련 이벤트
export const VOLUME_EVENTS = {
  // 볼륨 삭제에 필요한 정보 전달 이벤트
  sendDeleteVolume: "volume:send-delete-volume",
  // 볼륨 선택 모달 초기화 이벤트
  clearSelectVolumeModal: "volume:clear-select-volume-modal",
  // 볼륨 파일 압축에 필요한 정보 전달 이벤트
  sendCompressVolumeFile: "volume:send-compress-volume-file",
  // 볼륨 폴더 추가에 필요한 정보 전달 이벤트
  sendCreateVolumeFolder: "volume:send-create-volume-folder",
} as const;

// 그룹 관련 이벤트
export const GROUP_EVENTS = {
  // 그룹 삭제에 필요한 정보 전달 이벤트
  sendDeleteGroup: "group:send-delete-group",
} as const;

// 사용자 관련 이벤트
export const ACCOUNT_EVENTS = {
  // 사용자 정보 수정에 필요한 정보 전달 이벤트
  sendUpdateAccount: "account:send-update-account",
  // 사용자 삭제에 필요한 정보 전달 이벤트
  sendDeleteAccount: "account:send-delete-account",
  // 승인 대기 사용자 삭제에 필요한 정보 전달 이벤트
  sendDeleteAccountPending: "account:send-delete-account-pending",
} as const;

// 노드 관련 이벤트
export const NODE_EVENTS = {
  // MPS 설정 수정에 필요한 정보 전달 이벤트
  sendUpdateMps: "node:send-update-mps",
  // MIG 설정 수정에 필요한 정보 전달 이벤트
  sendUpdateMig: "node:send-update-mig",
} as const;

// Redfish 관련 이벤트
export const REDFISH_EVENTS = {
  // BMC 관리(Create/Update)에 필요한 정보 전달 이벤트
  sendCreateBmc: "redfish:send-manage-bmc",
  sendUpdateBmc: "redfish:send-manage-bmc",
  // Network Adapters 모달 표시 여부
  sendNetworkAdapter: "redfish:send-view-network-adapter",
} as const;

// 이미지 요청 관련 이벤트
export const REQUEST_IMAGE_EVENTS = {
  // 이미지 요청 승인 모달에 필요한 정보 전달 이벤트
  sendApproveImage: "request-image:send-approve-image",
  // 이미지 요청 반려 모달에 필요한 정보 전달 이벤트
  sendRejectImage: "request-image:send-reject-image",
} as const;

// 내부 레지스트리 관련 이벤트
export const INTERNAL_REGISTRY_EVENTS = {} as const;

// 내부 레지스트리 이미지 관련 이벤트
export const INTERNAL_REGISTRY_IMAGE_EVENTS = {
  // 내부 레지스트리 이미지 수정에 필요한 정보 전달 이벤트
  sendUpdateImage:
    "internal-registry-image:send-update-internal-registry-image",
  // 내부 레지스트리 이미지 삭제에 필요한 정보 전달 이벤트
  sendDeleteImage:
    "internal-registry-image:send-delete-internal-registry-image",
  // 내부 레지스트리 이미지 태그 삭제에 필요한 정보 전달 이벤트
  sendDeleteImageTag:
    "internal-registry-image:send-delete-internal-registry-image-tag",
  // 관리자 내부 레지스트리 이미지 삭제에 필요한 정보 전달 이벤트
  sendDeleteAdminRegistryImage:
    "internal-registry-image:send-delete-admin-internal-registry-image",
} as const;

// 리포트 관련 이벤트
// const REPORT_EVENTS = {
//   // 리포트 생성에 필요한 정보 전달 이벤트
//   sendCreateReport: "report:send-create-report",
// } as const;
// 모니터링 관련 이벤트
export const MONITORING_EVENTS = {
  // 모니터링 알림 생성/수정 모달 열기 이벤트
  openNotificationModal: "monitoring:open-notification-modal",
  // 모니터링 알림 상세 보기 모달에 필요한 정보 전달 이벤트
  sendNotificationSetting: "monitoring:send-notification-setting",
  // 모니터링 알림 내역 상세 모달에 필요한 정보 전달 이벤트
  sendNotificationHistory: "monitoring:send-notification-history",
} as const;

// 설정 관련 이벤트
export const SETTING_EVENTS = {
  // 알림설정 모달에 필요한 정보 전달 이벤트
  sendUpdateNotificationSetting: "setting:send-update-notification-setting",
} as const;

// 쿠버네티스 모니터링 관련 이벤트
export const KUBERNETES_MONITORING_EVENTS = {
  // 쿠버네티스 이벤트 상세 모달에 필요한 정보 전달 이벤트
  sendKubernetesEventDetail:
    "kubernetes-monitoring:send-kubernetes-event-detail",
} as const;

// 공통 이벤트
export const COMMON_EVENTS = {
  // 공통 취약점 모달에 필요한 정보 전달 이벤트
  sendVulnerability: "common:send-vulnerability",
  // 공통 신청 사유 모달에 필요한 정보 전달 이벤트
  sendRequestReason: "common:send-request-reason",
  // 공통 반려 사유 모달에 필요한 정보 전달 이벤트
  sendRejectReason: "common:send-reject-reason",
  // 프로필 팝오버에 필요한 정보 전달 이벤트
  sendProfile: "common:send-profile",
  // 비밀번호 재확인 모달에 필요한 정보 전달 이벤트
  sendCheckPassword: "user:send-check-password",
  // 비밀번호 수정 모달에 필요한 정보 전달 이벤트
  sendUpdatePassword: "user:send-update-password",
} as const;
