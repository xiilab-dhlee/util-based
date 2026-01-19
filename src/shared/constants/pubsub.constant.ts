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
  // 관리자용 워크스페이스 단일 삭제에 필요한 정보 전달 이벤트
  sendDeleteAdminWorkspace: "workspace:send-delete-admin-workspace",
  // 관리자용 워크스페이스 일괄 삭제에 필요한 정보 전달 이벤트
  sendDeleteAdminWorkspaces: "workspace:send-delete-admin-workspaces",
  // 워크스페이스 나가기에 필요한 정보 전달 이벤트
  sendLeaveWorkspace: "workspace:send-leave-workspace",
  // 기본 워크스페이스 설정 모달에 필요한 정보 전달 이벤트
  sendSetDefaultWorkspace: "workspace:send-set-default-workspace",
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
  // 워크스페이스 리소스 할당량 수정 모달에 필요한 정보 전달 이벤트
  sendUpdateResourceAllocation: "workspace:send-update-resource-allocation",
} as const;

// 워크로드 관련 이벤트
export const WORKLOAD_EVENTS = {
  // 워크로드 수정에 필요한 정보 전달 이벤트
  sendUpdateWorkload: "workload:send-update-workload",
  // 워크로드 삭제에 필요한 정보 전달 이벤트
  sendDeleteWorkload: "workload:send-delete-workload",
  // 워크로드 종료에 필요한 정보 전달 이벤트
  sendStopWorkload: "workload:send-stop-workload",
  // 워크로드 재시작에 필요한 정보 전달 이벤트
  sendRestartWorkload: "workload:send-restart-workload",
  // 커밋 이미지 생성에 필요한 정보 전달 이벤트
  sendCommitImage: "workload:send-commit-image",
  // 워크로드 모니터링에 필요한 정보 전달 이벤트
  sendWorkloadMonitoring: "workload:send-workload-monitoring",
  // 워크로드 생성 시 필요한 정보 전달 이벤트
  sendCreateWorkload: "workload:send-create-workload",
  // 워크로드 폴더 추가에 필요한 정보 전달 이벤트
  sendCreateWorkloadFolder: "workload:send-create-workload-folder",
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
  // 볼륨 파일 삭제에 필요한 정보 전달 이벤트
  sendDeleteVolumeFile: "volume:send-delete-volume-file",
  // 볼륨 파일 압축에 필요한 정보 전달 이벤트
  sendCompressVolumeFile: "volume:send-compress-volume-file",
  // 볼륨 파일 압축 해제에 필요한 정보 전달 이벤트
  sendDecompressVolumeFile: "volume:send-decompress-volume-file",
  // 볼륨 파일 다운로드에 필요한 정보 전달 이벤트
  sendDownloadVolumeFile: "volume:send-download-volume-file",
  // 볼륨 파일 업로드에 필요한 정보 전달 이벤트
  sendUploadVolumeFile: "volume:send-upload-volume-file",
  // 볼륨 폴더 추가에 필요한 정보 전달 이벤트
  sendCreateVolumeFolder: "volume:send-create-volume-folder",
  // 볼륨 스토리지 타입 선택에 필요한 정보 전달 이벤트
  sendStorageType: "volume:send-storage-type",
} as const;

// 그룹 관련 이벤트
export const GROUP_EVENTS = {
  // 그룹 생성/수정 모달 열기 이벤트
  openGroupModal: "group:open-group-modal",
  // 그룹 삭제에 필요한 정보 전달 이벤트
  sendDeleteGroup: "group:send-delete-group",
  // 멤버 추가 모달 열기 이벤트
  openMemberModal: "group:open-member-modal",
  // 멤버 선택 확인 이벤트
  confirmMemberSelection: "group:confirm-member-selection",
} as const;

// 사용자 관련 이벤트
export const ACCOUNT_EVENTS = {
  // 사용자 정보 수정에 필요한 정보 전달 이벤트
  sendUpdateAccount: "account:send-update-account",
  // 사용자 삭제에 필요한 정보 전달 이벤트
  sendDeleteAccount: "account:send-delete-account",
  // 승인 대기 사용자 삭제에 필요한 정보 전달 이벤트
  sendDeleteAccountPending: "account:send-delete-account-pending",
  // 사용자 상태 변경에 필요한 정보 전달 이벤트
  sendUpdateAccountStatus: "account:send-update-account-status",
  // 가입 승인에 필요한 정보 전달 이벤트
  sendApproveAccountPending: "account:send-approve-account-pending",
  // 가입 반려에 필요한 정보 전달 이벤트
  sendRejectAccountPending: "account:send-reject-account-pending",
  // 계정 상세 정보 보기에 필요한 정보 전달 이벤트
  sendViewAccountDetail: "account:send-view-account-detail",
  // 비밀번호 초기화에 필요한 정보 전달 이벤트
  sendResetPassword: "account:send-reset-password",
  // 비밀번호 초기화 결과 표시 이벤트
  showResetPasswordResult: "account:show-reset-password-result",
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

// 개인 레지스트리 관련 이벤트
export const PRIVATE_REGISTRY_EVENTS = {
  // 프라이빗 레지스트리 이미지 삭제에 필요한 정보 전달 이벤트
  sendDeletePrivateRegistry: "private-registry:send-delete-private-registry",
  // 프라이빗 레지스트리 이미지 태그 삭제에 필요한 정보 전달 이벤트
  sendDeleteImageTag: "private-registry:send-delete-image-tag",
  // 프라이빗 레지스트리 구분 선택 후 생성 모달에 전달 이벤트
  sendType: "private-registry:send-type",
  // 프라이빗 레지스트리 구분 선택 모달 초기화 이벤트
  clearSelectDivisionModal: "private-registry:clear-select-division-modal",
  // 프라이빗 레지스트리 이미지 태그 생성에 필요한 정보 전달 이벤트
  sendCreateTagData: "private-registry:send-create-tag-data",
  // 이미지 등록 Job 재시작에 필요한 정보 전달 이벤트
  sendRestartImageJob: "private-registry:send-restart-image-job",
  // 이미지 등록 Job 종료에 필요한 정보 전달 이벤트
  sendStopImageJob: "private-registry:send-stop-image-job",
  // 프라이빗 레지스트리 이미지 태그 상세 보기에 필요한 정보 전달 이벤트
  sendViewTagDetail: "private-registry:send-view-tag-detail",
} as const;

// 파일 보안 관련 이벤트
export const FILE_SECURITY_EVENTS = {
  // 파일 보안 취약점 상세 모달에 필요한 정보 전달 이벤트
  sendVulnerabilityInfo: "file-security:send-vulnerability-info",
} as const;

// 레지스트리 보안 관련 이벤트
export const REGISTRY_SECURITY_EVENTS = {
  // 레지스트리 보안 취약점 상세 모달에 필요한 정보 전달 이벤트
  sendVulnerabilityInfo: "registry-security:send-vulnerability-info",
} as const;

// 리포트 관련 이벤트
export const REPORT_EVENTS = {
  // 리포트 삭제에 필요한 정보 전달 이벤트
  sendDeleteReport: "report:send-delete-report",
} as const;

// 리포트 예약 관련 이벤트
export const RESERVATION_EVENTS = {
  // 예약발송 활성화/비활성화 토글에 필요한 정보 전달 이벤트
  sendToggleReservationSchedule: "reservation:send-toggle-reservation-schedule",
  // 예약 삭제에 필요한 정보 전달 이벤트
  sendDeleteReservation: "reservation:send-delete-reservation",
  // 리포트 예약 멤버 추가 모달 열기 이벤트
  openMemberModal: "reservation:open-member-modal",
  // 리포트 예약 멤버 선택 확인 이벤트
  confirmMemberSelection: "reservation:confirm-member-selection",
  // 리포트 예약 상세 모달 열기 이벤트
  openReservationDetailModal: "reservation:open-reservation-detail-modal",
  // 리포트 예약 수정 모달 열기 이벤트
  openReservationEditModal: "reservation:open-reservation-edit-modal",
} as const;
// 모니터링 관련 이벤트
export const MONITORING_EVENTS = {
  // 모니터링 알림 생성/수정 모달 열기 이벤트
  openNotificationModal: "monitoring:open-notification-modal",
  // 모니터링 알림 상세 보기 모달에 필요한 정보 전달 이벤트
  sendNotificationSetting: "monitoring:send-notification-setting",
  // 모니터링 알림 내역 상세 모달에 필요한 정보 전달 이벤트
  sendNotificationHistory: "monitoring:send-notification-history",
  // 사용자 워크스페이스 정보 모달에 필요한 정보 전달 이벤트
  sendUserWorkspace: "monitoring:send-user-workspace",
} as const;

// 알림 관련 이벤트
export const NOTIFICATION_EVENTS = {
  // 알림 삭제에 필요한 정보 전달 이벤트
  sendDeleteNotification: "notification:send-delete-notification",
} as const;

// 설정 관련 이벤트
export const SETTING_EVENTS = {
  // 알림설정 모달에 필요한 정보 전달 이벤트
  sendUpdateNotificationSetting: "setting:send-update-notification-setting",
  // 워크스페이스 구성원 추가 모달에 필요한 정보 전달 이벤트
  sendAddWorkspaceMember: "setting:send-add-workspace-member",
  // 워크스페이스 구성원 권한 수정 모달에 필요한 정보 전달 이벤트
  sendUpdateWorkspaceMemberRole: "setting:send-update-workspace-member-role",
  // 워크스페이스 구성원 삭제 모달에 필요한 정보 전달 이벤트
  sendDeleteWorkspaceMember: "setting:send-delete-workspace-member",
  // 리소스 요청 취소 모달에 필요한 정보 전달 이벤트
  sendCancelResourceRequest: "setting:send-cancel-resource-request",
} as const;

// 시스템 설정 관련 이벤트
export const SYSTEM_SETTING_EVENTS = {
  // SMTP 등록/수정 모달 열기 이벤트
  openSmtpModal: "system-setting:open-smtp-modal",
  // SMTP 삭제 모달 열기 이벤트
  openSmtpDeleteModal: "system-setting:open-smtp-delete-modal",
  // 스토리지 추가 모달 열기 이벤트
  openStorageCreateModal: "system-setting:open-storage-create-modal",
  // 스토리지 삭제 모달 열기 이벤트
  openStorageDeleteModal: "system-setting:open-storage-delete-modal",
  // 스토리지 상세 모달 열기 이벤트
  openStorageDetailModal: "system-setting:open-storage-detail-modal",
  // 스토리지 수정 모달 열기 이벤트
  openStorageEditModal: "system-setting:open-storage-edit-modal",
  // 라이선스 갱신 모달 열기 이벤트
  openLicenseRenewalModal: "system-setting:open-license-renewal-modal",
  // HPE OneView 연동 모달 열기 이벤트
  openHpeConnectionModal: "system-setting:open-hpe-connection-modal",
  // 크레덴셜 상세 모달 열기 이벤트
  openCredentialDetailModal: "system-setting:open-credential-detail-modal",
  // 크레덴셜 삭제 모달 열기 이벤트
  openCredentialDeleteModal: "system-setting:open-credential-delete-modal",
  // 워크스페이스 리소스 설정 모달 열기 이벤트
  openWorkspaceResourceSettingModal:
    "system-setting:open-workspace-resource-setting-modal",
} as const;

// 쿠버네티스 모니터링 관련 이벤트
export const KUBERNETES_MONITORING_EVENTS = {
  // 쿠버네티스 이벤트 상세 모달에 필요한 정보 전달 이벤트
  sendKubernetesEventDetail:
    "kubernetes-monitoring:send-kubernetes-event-detail",
  // 쿠버네티스 리소스 Describe 모달에 필요한 정보 전달 이벤트
  sendResourceDescribe: "kubernetes-monitoring:send-resource-describe",
  // 쿠버네티스 리소스 YAML 모달에 필요한 정보 전달 이벤트
  sendResourceYaml: "kubernetes-monitoring:send-resource-yaml",
} as const;

// 리소스 프리셋 관련 이벤트
export const RESOURCE_PRESET_EVENTS = {
  // 리소스 프리셋 삭제에 필요한 정보 전달 이벤트
  sendDeleteResourcePreset: "resource-preset:send-delete-resource-preset",
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
