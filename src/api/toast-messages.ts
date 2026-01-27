import { MUTATION_KEYS, type MutationKey } from "./generated/mutation-keys";

/**
 * Mutation Toast Messages Registry
 *
 * Orval이 생성한 mutationKey와 타입 안전하게 매칭되는 토스트 메시지
 *
 * 성공 메시지: 프론트엔드 정의 (사용자 확인 메시지)
 * 에러 메시지: 백엔드 제공 (API 응답에서)
 */
export const MUTATION_MESSAGES: Partial<
  Record<MutationKey, { success?: string }>
> = {
  // ============================================
  // Account Management (Admin)
  // ============================================
  [MUTATION_KEYS.updateAccount]: {
    success: "계정 정보가 수정되었습니다.",
  },
  [MUTATION_KEYS.updateAdminNotificationSet]: {
    success: "알림 설정이 변경되었습니다.",
  },
  [MUTATION_KEYS.deleteAccount]: {
    success: "계정이 삭제되었습니다.",
  },
  [MUTATION_KEYS.updateAccountEnabled]: {
    success: "계정 상태가 변경되었습니다.",
  },
  [MUTATION_KEYS.approveSignupRequests]: {
    success: "가입이 승인되었습니다.",
  },
  [MUTATION_KEYS.rejectSignupRequests]: {
    success: "가입을 반려했습니다.",
  },
  [MUTATION_KEYS.resetPasswordByAdmin]: {
    success: "비밀번호가 초기화되었습니다.",
  },

  // ============================================
  // Account (User)
  // ============================================
  [MUTATION_KEYS.updateNotificationSet]: {
    success: "알림 설정이 변경되었습니다.",
  },
  [MUTATION_KEYS.updateProfile]: {
    success: "프로필이 수정되었습니다.",
  },
  [MUTATION_KEYS.markNotificationAsRead]: {
    success: "알림을 읽음 처리했습니다.",
  },
  [MUTATION_KEYS.resetPassword]: {
    success: "비밀번호가 변경되었습니다.",
  },
  [MUTATION_KEYS.pinWorkspace]: {
    success: "워크스페이스가 고정되었습니다.",
  },
  [MUTATION_KEYS.unpinWorkspace]: {
    success: "워크스페이스 고정이 해제되었습니다.",
  },
  // [MUTATION_KEYS.signup]: {
  //   success: "회원가입이 완료되었습니다.",
  // },
  [MUTATION_KEYS.requestPasswordReset]: {
    success: "비밀번호 재설정 이메일이 발송되었습니다.",
  },
  [MUTATION_KEYS.verifyPasswordResetCode]: {
    success: "인증 코드가 확인되었습니다.",
  },

  // ============================================
  // Group Management
  // ============================================
  [MUTATION_KEYS.updateGroup]: {
    success: "그룹이 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteGroup]: {
    success: "그룹이 삭제되었습니다.",
  },
  [MUTATION_KEYS.createGroup]: {
    success: "그룹이 생성되었습니다.",
  },
  [MUTATION_KEYS.removeUserFromGroup]: {
    success: "사용자가 그룹에서 제거되었습니다.",
  },

  // ============================================
  // Workspace
  // ============================================
  [MUTATION_KEYS.createWorkspace]: {
    success: "워크스페이스가 생성되었습니다.",
  },
  [MUTATION_KEYS.updateWorkspace]: {
    success: "워크스페이스가 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteWorkspace]: {
    success: "워크스페이스가 삭제되었습니다.",
  },
  [MUTATION_KEYS.setDefaultWorkspace]: {
    success: "기본 워크스페이스가 설정되었습니다.",
  },
  [MUTATION_KEYS.leaveWorkspace]: {
    success: "워크스페이스를 나갔습니다.",
  },
  [MUTATION_KEYS.updateMemberRole]: {
    success: "권한이 수정되었습니다.",
  },
  [MUTATION_KEYS.createResourceRequest]: {
    success: "리소스 요청이 생성되었습니다.",
  },
  [MUTATION_KEYS.addWorkspaceMembers]: {
    success: "구성원이 추가되었습니다.",
  },
  [MUTATION_KEYS.deleteWorkspaceMembers]: {
    success: "구성원이 삭제되었습니다.",
  },
  [MUTATION_KEYS.cancelResourceRequest]: {
    success: "리소스 요청이 취소되었습니다.",
  },

  // ============================================
  // Workspace Management (Admin)
  // ============================================
  [MUTATION_KEYS.updateWorkspaceResource]: {
    success: "워크스페이스 리소스가 수정되었습니다.",
  },
  [MUTATION_KEYS.rejectResourceRequest]: {
    success: "리소스 요청을 반려했습니다.",
  },
  [MUTATION_KEYS.approveResourceRequest]: {
    success: "리소스 요청이 승인되었습니다.",
  },
  [MUTATION_KEYS.updatePolicySet]: {
    success: "정책이 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteWorkspaces]: {
    success: "워크스페이스가 삭제되었습니다.",
  },

  // ============================================
  // Credential
  // ============================================
  [MUTATION_KEYS.createCredential]: {
    success: "크리덴셜이 생성되었습니다.",
  },
  [MUTATION_KEYS.deleteCredential]: {
    success: "크리덴셜이 삭제되었습니다.",
  },

  // ============================================
  // License
  // ============================================
  [MUTATION_KEYS.createLicense]: {
    success: "라이선스가 생성되었습니다.",
  },

  // ============================================
  // SMTP Settings
  // ============================================
  [MUTATION_KEYS.registerSmtpSet]: {
    success: "SMTP 설정이 등록되었습니다.",
  },
  [MUTATION_KEYS.deleteSmtpSet]: {
    success: "SMTP 설정이 삭제되었습니다.",
  },

  // ============================================
  // Registry (Private)
  // ============================================
  [MUTATION_KEYS.updatePrivateImageTag]: {
    success: "태그 설명이 수정되었습니다.",
  },
  [MUTATION_KEYS.createPrivateExternalImage]: {
    success:
      "컨테이너 이미지 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },
  [MUTATION_KEYS.addPrivateImageTag]: {
    success:
      "컨테이너 이미지 태그 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },
  [MUTATION_KEYS.scanPrivateImageTag]: {
    success: "취약점 스캔이 시작되었습니다.",
  },
  [MUTATION_KEYS.deletePrivateImageTags]: {
    success: "이미지 태그가 삭제되었습니다.",
  },
  [MUTATION_KEYS.deletePrivateImages]: {
    success: "레지스트리 이미지가 삭제되었습니다.",
  },

  // ============================================
  // Registry (Public)
  // ============================================
  [MUTATION_KEYS.updatePublicImageTag]: {
    success: "태그 설명이 수정되었습니다.",
  },
  [MUTATION_KEYS.createPublicExternalImage]: {
    success:
      "컨테이너 이미지 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },
  [MUTATION_KEYS.addPublicImageTag]: {
    success:
      "컨테이너 이미지 태그 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },
  [MUTATION_KEYS.scanPublicImageTag]: {
    success: "취약점 스캔이 시작되었습니다.",
  },
  [MUTATION_KEYS.deletePublicImageTags]: {
    success: "이미지 태그가 삭제되었습니다.",
  },
  [MUTATION_KEYS.deletePublicImages]: {
    success: "레지스트리 이미지가 삭제되었습니다.",
  },

  // ============================================
  // Image Tag Usage Request
  // ============================================
  [MUTATION_KEYS.createUsageRequest]: {
    success: "사용 요청이 전송되었습니다.",
  },

  // ============================================
  // Image Job
  // ============================================
  [MUTATION_KEYS.restartImageJob]: {
    success: "컨테이너 이미지 등록 재시작 요청이 완료되었습니다.",
  },
  [MUTATION_KEYS.deleteImageJob]: {
    success: "컨테이너 이미지 등록 종료 요청이 완료되었습니다.",
  },

  // ============================================
  // Storage (Admin)
  // ============================================
  [MUTATION_KEYS.registerStorage]: {
    success: "스토리지가 등록되었습니다.",
  },
  [MUTATION_KEYS.updateStorage]: {
    success: "스토리지가 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteStorage]: {
    success: "스토리지가 삭제되었습니다.",
  },

  // ============================================
  // Volume
  // ============================================
  [MUTATION_KEYS.updateVolume]: {
    success: "볼륨이 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteVolume]: {
    success: "볼륨이 삭제되었습니다.",
  },
  [MUTATION_KEYS.registerOnPremiseVolume]: {
    success: "볼륨이 생성되었습니다.",
  },
  [MUTATION_KEYS.registerAstragoVolume]: {
    success: "볼륨이 생성되었습니다.",
  },

  // ============================================
  // Sourcecode
  // ============================================
  [MUTATION_KEYS.registerSourceCode]: {
    success: "소스코드가 생성되었습니다.",
  },
  [MUTATION_KEYS.updateSourceCode]: {
    success: "소스코드가 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteSourceCode]: {
    success: "소스코드가 삭제되었습니다.",
  },
  [MUTATION_KEYS.deleteSourceCodes]: {
    success: "소스코드가 삭제되었습니다.",
  },
  [MUTATION_KEYS.adminUpdateSourceCode]: {
    success: "소스코드가 수정되었습니다.",
  },
  [MUTATION_KEYS.adminDeleteSourceCode]: {
    success: "소스코드가 삭제되었습니다.",
  },
  [MUTATION_KEYS.adminDeleteSourceCodes]: {
    success: "소스코드가 삭제되었습니다.",
  },

  // ============================================
  // Workload Reclaim Policy
  // ============================================
  [MUTATION_KEYS.updateReclaimPolicy]: {
    success: "리소스 회수 기준이 수정되었습니다.",
  },
  [MUTATION_KEYS.updateReclaimPolicyEnabled]: {
    success: "리소스 회수 기준 활성화 상태가 변경되었습니다.",
  },

  // ============================================
  // Node (Admin Cluster)
  // ============================================
  [MUTATION_KEYS.applyMigConfiguration]: {
    success: "MIG 설정이 적용되었습니다.",
  },
  [MUTATION_KEYS.updateNodeScheduling]: {
    success: "노드 스케줄링 설정이 변경되었습니다.",
  },

  // ============================================
  // Volume TUS Upload
  // ============================================
  [MUTATION_KEYS.createUpload]: {
    success: "업로드가 생성되었습니다.",
  },
  [MUTATION_KEYS.cancelUpload]: {
    success: "업로드가 취소되었습니다.",
  },
  [MUTATION_KEYS.getUploadStatus]: {
    success: "업로드 상태를 조회했습니다.",
  },
  [MUTATION_KEYS.uploadChunk]: {
    success: "청크가 업로드되었습니다.",
  },

  // ============================================
  // Admin Resource Preset
  // ============================================
  [MUTATION_KEYS.updatePreset]: {
    success: "리소스 프리셋이 수정되었습니다.",
  },
  [MUTATION_KEYS.deletePreset]: {
    success: "리소스 프리셋이 삭제되었습니다.",
  },
  [MUTATION_KEYS.createPreset]: {
    success: "리소스 프리셋이 생성되었습니다.",
  },
  [MUTATION_KEYS.deletePresets]: {
    success: "리소스 프리셋이 삭제되었습니다.",
  },

  // ============================================
  // Image Tag Usage Request (Admin)
  // ============================================
  [MUTATION_KEYS.cancelUsageRequest]: {
    success: "사용 요청이 취소되었습니다.",
  },
  [MUTATION_KEYS.rejectUsageRequest]: {
    success: "사용 요청을 반려했습니다.",
  },
  [MUTATION_KEYS.updateDecisionReason]: {
    success: "승인/반려 사유가 수정되었습니다.",
  },
  [MUTATION_KEYS.approveUsageRequest]: {
    success: "사용 요청이 승인되었습니다.",
  },

  // ============================================
  // Cluster Resource
  // ============================================
  [MUTATION_KEYS.checkResourceAvailability]: {
    success: "리소스 가용성을 확인했습니다.",
  },

  // ============================================
  // Workload Reclaim Webhook
  // ============================================
  [MUTATION_KEYS.executeReclaim]: {
    success: "워크로드 회수가 실행되었습니다.",
  },

  // ============================================
  // Vulnerability Policy (Admin)
  // ============================================
  [MUTATION_KEYS.updateScanPolicy]: {
    success: "취약점 스캔 정책이 수정되었습니다.",
  },
  [MUTATION_KEYS.updateLevelPolicy]: {
    success: "취약점 수준 정책이 수정되었습니다.",
  },
  [MUTATION_KEYS.updateAstragoOnlyPolicy]: {
    success: "Astrago 전용 정책이 수정되었습니다.",
  },

  // ============================================
  // Account Notification
  // ============================================
  [MUTATION_KEYS.deleteNotifications]: {
    success: "알림이 삭제되었습니다.",
  },

  // ============================================
  // Registry (Private) - Snapshot
  // ============================================
  [MUTATION_KEYS.createPrivateSnapshotImage]: {
    success:
      "스냅샷 이미지 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },

  // ============================================
  // Registry (Public) - Snapshot
  // ============================================
  [MUTATION_KEYS.createPublicSnapshotImage]: {
    success:
      "스냅샷 이미지 생성이 정상적으로 요청되었습니다. 등록 중인 이미지 목록에서 상태 확인이 가능합니다.",
  },

  // ============================================
  // Admin Volume
  // ============================================
  [MUTATION_KEYS.adminUpdateVolume]: {
    success: "볼륨이 수정되었습니다.",
  },
  [MUTATION_KEYS.adminDeleteVolume]: {
    success: "볼륨이 삭제되었습니다.",
  },
  [MUTATION_KEYS.adminCreateFolder]: {
    success: "폴더가 생성되었습니다.",
  },
  [MUTATION_KEYS.adminDownload]: {
    success: "다운로드가 시작되었습니다.",
  },
  [MUTATION_KEYS.adminDeleteFiles]: {
    success: "파일이 삭제되었습니다.",
  },
  [MUTATION_KEYS.adminDecompress]: {
    success: "압축 해제 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.adminCompress]: {
    success: "압축 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.adminDeleteVolumes]: {
    success: "볼륨이 삭제되었습니다.",
  },

  // ============================================
  // Volume File
  // ============================================
  [MUTATION_KEYS.downloadFiles]: {
    success: "다운로드가 시작되었습니다.",
  },
  [MUTATION_KEYS.decompressFile]: {
    success: "압축 해제 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.compressFiles]: {
    success: "압축 요청이 전송되었습니다.",
  },

  // ============================================
  // Admin Queue
  // ============================================
  [MUTATION_KEYS.removeWorkloadFromUrgentStandby]: {
    success: "긴급 대기 목록에서 제거되었습니다.",
  },
  [MUTATION_KEYS.updateUrgentStandbyOrder]: {
    success: "긴급 대기 순서가 변경되었습니다.",
  },
  [MUTATION_KEYS.addWorkloadToUrgentStandby]: {
    success: "긴급 대기 목록에 추가되었습니다.",
  },

  // ============================================
  // Admin Monitoring Notification
  // ============================================
  [MUTATION_KEYS.updateMonitoringNotificationSet]: {
    success: "모니터링 알림 설정이 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteMonitoringNotificationSet]: {
    success: "모니터링 알림 설정이 삭제되었습니다.",
  },
  [MUTATION_KEYS.updateMonitoringNotificationSetEnabled]: {
    success: "모니터링 알림 설정 활성화 상태가 변경되었습니다.",
  },
  [MUTATION_KEYS.createMonitoringNotificationSet]: {
    success: "모니터링 알림 설정이 생성되었습니다.",
  },

  // ============================================
  // Workload
  // ============================================
  [MUTATION_KEYS.updateWorkload]: {
    success: "워크로드가 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteWorkload]: {
    success: "워크로드가 삭제되었습니다.",
  },
  [MUTATION_KEYS.updateResourcePreset]: {
    success: "리소스 프리셋이 수정되었습니다.",
  },
  [MUTATION_KEYS.createWorkload]: {
    success: "워크로드가 생성되었습니다.",
  },
  [MUTATION_KEYS.workloadCreateFolder]: {
    success: "폴더가 생성되었습니다.",
  },
  [MUTATION_KEYS.workloadDeleteFiles]: {
    success: "파일이 삭제되었습니다.",
  },
  [MUTATION_KEYS.workloadDecompressFile]: {
    success: "압축 해제 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.workloadCompressFiles]: {
    success: "압축 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.terminateWorkload]: {
    success: "워크로드가 종료되었습니다.",
  },
  [MUTATION_KEYS.restartWorkload]: {
    success: "워크로드가 재시작되었습니다.",
  },

  // ============================================
  // Volume (Admin)
  // ============================================
  [MUTATION_KEYS.deleteVolumes]: {
    success: "볼륨이 삭제되었습니다.",
  },

  // ============================================
  // Monitoring Notification Webhook
  // ============================================
  [MUTATION_KEYS.receiveAlert]: {
    success: "알림이 수신되었습니다.",
  },
};
