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
  // 워크스페이스 리소스 요청 취소에 필요한 정보 전달 이벤트
  sendDeleteResource: "workspace:send-cancel-resource",
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
  // 워크로드 파일 삭제 모달 열기
  openDeleteFileModal: "workload:open-delete-file-modal",
  // 워크로드 파일 압축 모달 열기
  openCompressFileModal: "workload:open-compress-file-modal",
  // 워크로드 파일 압축 해제 모달 열기
  openDecompressFileModal: "workload:open-decompress-file-modal",
  // 워크로드 파일 다운로드 모달 열기
  openDownloadFileModal: "workload:open-download-file-modal",
  // 워크로드 파일 업로드 모달 열기
  openUploadFileModal: "workload:open-upload-file-modal",
  // 워크로드 폴더 생성 모달 열기
  openCreateFolderModal: "workload:open-create-folder-modal",
} as const;

// 소스코드 관련 이벤트
export const SOURCECODE_EVENTS = {
  // 소스코드 생성 모달 열기 이벤트
  openCreateModal: "sourcecode:open-create-modal",
  // 소스코드 삭제에 필요한 정보 전달 이벤트
  openDeleteModal: "sourcecode:open-delete-modal",
} as const;

// 볼륨 관련 이벤트
export const VOLUME_EVENTS = {
  // 스토리지 타입 선택 모달 열기
  openSelectStorageTypeModal: "volume:open-select-storage-type-modal",
  // AstraGo 볼륨 생성 모달 열기
  openCreateAstragoModal: "volume:open-create-astrago-modal",
  // 온프레미스 볼륨 생성 모달 열기
  openCreateOnPremModal: "volume:open-create-onprem-modal",
  // 볼륨 삭제 모달 열기
  openDeleteModal: "volume:open-delete-modal",
  // 볼륨 파일 삭제 모달 열기
  openDeleteFileModal: "volume:open-delete-file-modal",
  // 볼륨 파일 압축 모달 열기
  openCompressFileModal: "volume:open-compress-file-modal",
  // 볼륨 파일 압축 해제 모달 열기
  openDecompressFileModal: "volume:open-decompress-file-modal",
  // 볼륨 파일 다운로드 모달 열기
  openDownloadFileModal: "volume:open-download-file-modal",
  // 볼륨 파일 업로드 모달 열기
  openUploadFileModal: "volume:open-upload-file-modal",
  // 볼륨 폴더 생성 모달 열기
  openCreateFolderModal: "volume:open-create-folder-modal",
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
  // MIG 설정 모달 열기 이벤트
  openUpdateMigModal: "node:open-update-mig-modal",
} as const;

// 이미지 사용 요청 관련 이벤트
export const REQUEST_IMAGE_EVENTS = {
  // 이미지 사용 요청 승인 모달 열기
  openApproveModal: "request-image:open-approve-modal",
  // 이미지 사용 요청 반려 모달 열기
  openRejectModal: "request-image:open-reject-modal",
} as const;

// 개인 레지스트리 관련 이벤트
export const REGISTRY_EVENTS = {
  // 보안 레벨 설정 모달 열기
  openSecurityLevelSettingModal: "registry:open-security-level-setting-modal",
  // 레지스트리 이미지 유형 선택 모달 열기
  openSelectTypeModal: "registry:open-select-type-modal",
  // 레지스트리 이미지 생성 모달 열기
  openCreateModal: "registry:open-create-modal",
  // 레지스트리 이미지 삭제 모달 열기
  openDeleteModal: "registry:open-delete-modal",
  // 레지스트리 로그 보기 모달 열기
  openLogModal: "registry:open-log-modal",
  // 레지스트리 스트리밍 로그 보기 모달 열기
  openStreamLogModal: "registry:open-stream-log-modal",
  // 이미지 등록 Job 재시작 모달 열기
  openRestartJobModal: "registry:open-restart-job-modal",
  // 이미지 등록 Job 종료 모달 열기
  openStopJobModal: "registry:open-stop-job-modal",
  // 레지스트리 이미지 태그 삭제 모달 열기
  openDeleteTagModal: "registry:open-delete-tag-modal",
  // 레지스트리 이미지 태그 생성 모달 열기
  openCreateTagModal: "registry:open-create-tag-modal",
  // 레지스트리 이미지 태그 상세 보기 모달 열기
  openTagDetailModal: "registry:open-tag-detail-modal",
  // 레지스트리 이미지 태그 스캔 모달 열기
  openScanTagModal: "registry:open-scan-tag-modal",
  // 레지스트리 이미지 태그 수정 모달 열기
  openEditTagModal: "registry:open-edit-tag-modal",
  // 이미지 태그 사용 요청 모달 열기
  openRequestUseModal: "registry:open-request-use-modal",
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
  // 모니터링 알림 삭제 모달에 필요한 정보 전달 이벤트
  sendDeleteNotification: "monitoring:send-delete-notification",
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

// 크리덴셜 관련 이벤트
export const CREDENTIAL_EVENTS = {
  // 크리덴셜 생성 모달 열기 이벤트
  openCreateModal: "credential:open-create-modal",
  // 크리덴셜 상세 모달 열기 이벤트
  openDetailModal: "credential:open-detail-modal",
  // 크리덴셜 삭제 모달 열기 이벤트
  openDeleteModal: "credential:open-delete-modal",
} as const;

// 스토리지 관련 이벤트
export const STORAGE_EVENTS = {
  // 스토리지 추가 모달 열기 이벤트
  openCreateModal: "storage:open-create-modal",
  // 스토리지 삭제 모달 열기 이벤트
  openDeleteModal: "storage:open-delete-modal",
  // 스토리지 상세 모달 열기 이벤트
  openDetailModal: "storage:open-detail-modal",
  // 스토리지 수정 모달 열기 이벤트
  openEditModal: "storage:open-edit-modal",
} as const;

// 시스템 설정 관련 이벤트
export const SYSTEM_SETTING_EVENTS = {
  // SMTP 등록 모달 열기 이벤트
  openCreateSmtpModal: "system-setting:open-create-smtp-modal",
  // SMTP 삭제 모달 열기 이벤트
  openSmtpDeleteModal: "system-setting:open-delete-smtp-modal",
  // 라이선스 갱신 모달 열기 이벤트
  openCreateLicenseModal: "system-setting:open-create-license-modal",
  // HPE OneView 연동 모달 열기 이벤트
  openHpeConnectionModal: "system-setting:open-hpe-connection-modal",
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

// 스케줄링 큐 관련 이벤트
export const SCHEDULING_QUEUE_EVENTS = {
  // 긴급 대기열 삭제 모달 열기 이벤트
  openDeleteUrgentQueueModal: "scheduling-queue:open-delete-urgent-queue-modal",
  // 긴급 대기열 순서 변경 확인 모달 열기 이벤트
  openReorderConfirmModal: "scheduling-queue:open-reorder-confirm-modal",
  // 긴급 대기열 등록 확인 모달 열기 이벤트
  openAddToQueueConfirmModal:
    "scheduling-queue:open-add-to-queue-confirm-modal",
} as const;

// 공통 이벤트
export const COMMON_EVENTS = {
  // 공통 취약점 모달에 필요한 정보 전달 이벤트
  sendVulnerability: "common:send-vulnerability",
  // 공통 신청 사유 모달 열기 이벤트
  openRequestReasonModal: "common:open-request-reason-modal",
  // 공통 반려 사유 모달 열기 이벤트
  openRejectReasonModal: "common:open-reject-reason-modal",
  // 공통 승인 사유 모달 열기 이벤트
  openApprovalReasonModal: "common:open-approval-reason-modal",
  // 프로필 팝오버에 필요한 정보 전달 이벤트
  sendProfile: "common:send-profile",
  // 비밀번호 재확인 모달에 필요한 정보 전달 이벤트
  sendCheckPassword: "user:send-check-password",
  // 프로필 수정 모달에 필요한 정보 전달 이벤트
  sendUpdateProfile: "user:send-update-profile",
} as const;
