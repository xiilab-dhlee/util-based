import { atom } from "jotai";

/**
 * 알림 설정 데이터 타입 정의
 */
export interface NotificationSetting {
  system: boolean;
  email: boolean;
}

/**
 * 알림 설정 전체 데이터 타입 정의
 */
export interface NotificationSettings {
  workspace: {
    resourceRequestResult: NotificationSetting;
  };
  workload: {
    batchJobCompletion: NotificationSetting;
    interactiveJobCompletion: NotificationSetting;
    interactiveJobTermination: NotificationSetting;
    imageCommitRegistration: NotificationSetting;
    workloadDeletion: NotificationSetting;
    workloadError: NotificationSetting;
  };
}

/**
 * 기본 알림 설정 값
 */
const defaultNotificationSettings: NotificationSettings = {
  workspace: {
    resourceRequestResult: { system: true, email: true },
  },
  workload: {
    batchJobCompletion: { system: true, email: false },
    interactiveJobCompletion: { system: true, email: false },
    interactiveJobTermination: { system: true, email: true },
    imageCommitRegistration: { system: true, email: false },
    workloadDeletion: { system: true, email: false },
    workloadError: { system: true, email: true },
  },
};

/**
 * 알림 설정 상태를 관리하는 atom
 */
export const notificationSettingsAtom = atom<NotificationSettings>(
  defaultNotificationSettings
);

/**
 * 알림 설정 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const notificationSettingModalOpenAtom = atom<boolean>(false);

/**
 * 리소스 설정 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const resourceSettingModalOpenAtom = atom<boolean>(false);

/**
 * 멤버 추가 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const memberAddModalOpenAtom = atom<boolean>(false);

/**
 * 크레덴셜 추가 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const credentialAddModalOpenAtom = atom<boolean>(false);

/**
 * 리소스 요청 데이터 타입 정의
 */
export interface ResourceRequest {
  id: number;
  gpu: string;
  cpu: string;
  mem: string;
  requestDate: string;
  requestTime: string;
  status: "대기" | "승인" | "반려";
  approvalDate: string;
  approvalTime: string;
  rejectionReason: string | null;
  reason: string;
}

/**
 * 멤버 데이터 타입 정의 (임시)
 */
export interface Member {
  key: number;
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  joinDate?: string;
  group?: string;
}

/**
 * 멤버 삭제 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const memberDeleteModalOpenAtom = atom<boolean>(false);

/**
 * 삭제할 멤버 데이터를 저장하는 atom
 */
export const memberDeleteDataAtom = atom<Member | null>(null);

/**
 * 멤버 상세 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const memberDetailModalOpenAtom = atom<boolean>(false);

/**
 * 상세 정보를 보여줄 멤버 데이터를 저장하는 atom
 */
export const memberDetailDataAtom = atom<Member | null>(null);

/**
 * 멤버 정보 수정 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const memberEditModalOpenAtom = atom<boolean>(false);

/**
 * 수정할 멤버 데이터를 저장하는 atom
 */
export const memberEditDataAtom = atom<Member | null>(null);

// 각 모달 열기/닫기 액션 atoms

/**
 * 알림 설정 모달 열기 액션 atom
 */
export const openNotificationSettingModalAtom = atom(null, (get, set) => {
  set(notificationSettingModalOpenAtom, true);
});

/**
 * 알림 설정 모달 닫기 액션 atom
 */
export const closeNotificationSettingModalAtom = atom(null, (get, set) => {
  set(notificationSettingModalOpenAtom, false);
});

/**
 * 리소스 설정 모달 열기 액션 atom
 */
export const openResourceSettingModalAtom = atom(null, (get, set) => {
  set(resourceSettingModalOpenAtom, true);
});

/**
 * 리소스 설정 모달 닫기 액션 atom
 */
export const closeResourceSettingModalAtom = atom(null, (get, set) => {
  set(resourceSettingModalOpenAtom, false);
});

/**
 * 멤버 추가 모달 열기 액션 atom
 */
export const openMemberAddModalAtom = atom(null, (get, set) => {
  set(memberAddModalOpenAtom, true);
});

/**
 * 멤버 추가 모달 닫기 액션 atom
 */
export const closeMemberAddModalAtom = atom(null, (get, set) => {
  set(memberAddModalOpenAtom, false);
});

/**
 * 크레덴셜 추가 모달 열기 액션 atom
 */
export const openCredentialAddModalAtom = atom(null, (get, set) => {
  set(credentialAddModalOpenAtom, true);
});

/**
 * 크레덴셜 추가 모달 닫기 액션 atom
 */
export const closeCredentialAddModalAtom = atom(null, (get, set) => {
  set(credentialAddModalOpenAtom, false);
});

/**
 * 멤버 삭제 모달 열기 액션 atom
 */
export const openMemberDeleteModalAtom = atom(
  null,
  (get, set, member: Member) => {
    set(memberDeleteDataAtom, member);
    set(memberDeleteModalOpenAtom, true);
  }
);

/**
 * 멤버 삭제 모달 닫기 액션 atom
 */
export const closeMemberDeleteModalAtom = atom(null, (get, set) => {
  set(memberDeleteModalOpenAtom, false);
  set(memberDeleteDataAtom, null);
});

/**
 * 멤버 상세 모달 열기 액션 atom
 */
export const openMemberDetailModalAtom = atom(
  null,
  (get, set, member: Member) => {
    set(memberDetailDataAtom, member);
    set(memberDetailModalOpenAtom, true);
  }
);

/**
 * 멤버 상세 모달 닫기 액션 atom
 */
export const closeMemberDetailModalAtom = atom(null, (get, set) => {
  set(memberDetailModalOpenAtom, false);
  set(memberDetailDataAtom, null);
});

/**
 * 멤버 정보 수정 모달 열기 액션 atom
 */
export const openMemberEditModalAtom = atom(
  null,
  (get, set, member: Member) => {
    set(memberEditDataAtom, member);
    set(memberEditModalOpenAtom, true);
  }
);

/**
 * 멤버 정보 수정 모달 닫기 액션 atom
 */
export const closeMemberEditModalAtom = atom(null, (get, set) => {
  set(memberEditModalOpenAtom, false);
  set(memberEditDataAtom, null);
});

/**
 * 반려 사유 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const rejectionReasonModalOpenAtom = atom<boolean>(false);

/**
 * 반려 사유 모달에 표시할 리소스 요청 데이터를 저장하는 atom
 */
export const rejectionReasonDataAtom = atom<ResourceRequest | null>(null);

/**
 * 요청 사유 모달의 열림/닫힘 상태를 관리하는 atom
 */
export const requestReasonModalOpenAtom = atom<boolean>(false);

/**
 * 요청 사유 모달에 표시할 리소스 요청 데이터를 저장하는 atom
 */
export const requestReasonDataAtom = atom<ResourceRequest | null>(null);

/**
 * 반려 사유 모달 열기 액션 atom
 */
export const openRejectionReasonModalAtom = atom(
  null,
  (get, set, resourceRequest: ResourceRequest) => {
    set(rejectionReasonDataAtom, resourceRequest);
    set(rejectionReasonModalOpenAtom, true);
  }
);

/**
 * 반려 사유 모달 닫기 액션 atom
 */
export const closeRejectionReasonModalAtom = atom(null, (get, set) => {
  set(rejectionReasonModalOpenAtom, false);
  set(rejectionReasonDataAtom, null);
});

/**
 * 요청 사유 모달 열기 액션 atom
 */
export const openRequestReasonModalAtom = atom(
  null,
  (get, set, resourceRequest: ResourceRequest) => {
    set(requestReasonDataAtom, resourceRequest);
    set(requestReasonModalOpenAtom, true);
  }
);

/**
 * 요청 사유 모달 닫기 액션 atom
 */
export const closeRequestReasonModalAtom = atom(null, (get, set) => {
  set(requestReasonModalOpenAtom, false);
  set(requestReasonDataAtom, null);
});
