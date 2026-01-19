"use client";

import { DeleteRequestResourceModal } from "@/domain/request-resource/components/delete-request-resource-modal";
import { AddWorkspaceMemberModal } from "@/domain/setting/components/add-workspace-member-modal";
import { CancelResourceRequestModal } from "@/domain/setting/components/cancel-resource-request-modal";
import { CreateResourceSettingModal } from "@/domain/setting/components/create-request-resource-modal";
import { SettingMainSection } from "@/domain/setting/components/setting-main-section";
import { SettingSubSection } from "@/domain/setting/components/setting-sub-section";
import { UpdateNotificationSettingModal } from "@/domain/setting/components/update-notification-setting-modal";
import { DeleteWorkspaceModal } from "@/domain/workspace/components/delete-workspace-modal";
import { LeaveWorkspaceModal } from "@/domain/workspace/components/leave-workspace-modal";
import { OwnerTransferRequiredModal } from "@/domain/workspace/components/owner-transfer-required-modal";
import { SetDefaultWorkspaceModal } from "@/domain/workspace/components/set-default-workspace-modal";
import { UpdateWorkspaceModal } from "@/domain/workspace/components/update-workspace-modal";
import { DeleteWorkspaceMemberModal } from "@/domain/workspace-member/components/delete-workspace-member-modal";
import { UpdateWorkspaceMemberModal } from "@/domain/workspace-member/components/update-workspace-member-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { CreateCredentialModal } from "@/shared/components/modal/create-credential-modal";
import { DeleteCredentialModal } from "@/shared/components/modal/delete-credential-modal";
import { ViewCredentialDetailModal } from "@/shared/components/modal/view-credential-detail-modal";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";

/**
 * 설정 페이지 메인 컴포넌트
 *
 */
export function SettingMain() {
  return (
    <>
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader pageKey="user.setting" description="Setting" />
      <SettingMainSection />
      <SettingSubSection />
      {/* 워크스페이스 수정 모달 */}
      <UpdateWorkspaceModal />
      {/* 워크스페이스 삭제 모달 */}
      <DeleteWorkspaceModal />
      {/* 워크스페이스 나가기 모달 */}
      <LeaveWorkspaceModal />
      {/* 기본 워크스페이스 설정/해제 모달 */}
      <SetDefaultWorkspaceModal />
      {/* 워크스페이스 나가기 권한 이전 필요 모달 */}
      <OwnerTransferRequiredModal />
      {/* 워크스페이스 멤버 삭제 모달 */}
      <DeleteWorkspaceMemberModal />
      {/* 워크스페이스 멤버 수정 모달 */}
      <UpdateWorkspaceMemberModal />
      {/* 요청 사유 모달 */}
      <ViewRejectReasonModal />
      {/* 반려 사유 모달 */}
      <ViewRequestReasonModal />
      {/* 리소스 요청 모달 */}
      <CreateResourceSettingModal />
      {/* 리소스 요청 취소 모달 */}
      <CancelResourceRequestModal />
      {/* 알림설정 모달 */}
      <UpdateNotificationSettingModal />
      {/* 크리덴셜 추가 모달 */}
      <CreateCredentialModal />
      {/* 크리덴셜 상세 모달 */}
      <ViewCredentialDetailModal />
      {/* 크리덴셜 삭제 모달 */}
      <DeleteCredentialModal />
      {/* 리소스 요청 삭제 모달 */}
      <DeleteRequestResourceModal />
      {/* 워크스페이스 구성원 추가 모달 */}
      <AddWorkspaceMemberModal />
    </>
  );
}
