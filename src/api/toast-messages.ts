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
    success: "레지스트리 이미지가 생성되었습니다.",
  },
  [MUTATION_KEYS.addPrivateImageTag]: {
    success: "이미지 태그가 추가되었습니다.",
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
    success: "레지스트리 이미지가 생성되었습니다.",
  },
  [MUTATION_KEYS.addPublicImageTag]: {
    success: "이미지 태그가 추가되었습니다.",
  },
  [MUTATION_KEYS.scanPublicImageTag]: {
    success: "취약점 스캔이 시작되었습니다.",
  },
  [MUTATION_KEYS.deletePublicImageTags]: {
    success: "이미지 태그가 삭제되었습니다.",
  },
  // TODO: MUTATION_KEYS.deletePublicImages가 생성되면 활성화
  // [MUTATION_KEYS.deletePublicImages]: {
  //   success: "레지스트리 이미지가 삭제되었습니다.",
  // },

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
  // Volume
  // ============================================
  [MUTATION_KEYS.updateVolume]: {
    success: "볼륨이 수정되었습니다.",
  },
  [MUTATION_KEYS.deleteVolume]: {
    success: "볼륨이 삭제되었습니다.",
  },
  [MUTATION_KEYS.createFolder]: {
    success: "폴더가 생성되었습니다.",
  },
  [MUTATION_KEYS.deleteFiles]: {
    success: "파일이 삭제되었습니다.",
  },
  [MUTATION_KEYS.decompress]: {
    success: "압축 해제 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.compress]: {
    success: "압축 요청이 전송되었습니다.",
  },
  [MUTATION_KEYS.registerOnPremiseVolume]: {
    success: "볼륨이 생성되었습니다.",
  },
  [MUTATION_KEYS.registerAstragoVolume]: {
    success: "볼륨이 생성되었습니다.",
  },
};
