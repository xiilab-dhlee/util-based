"use client";

import { DeleteWorkspaceModal } from "@/domain/workspace/components/delete-workspace-modal";
import { UpdateWorkspaceModal } from "@/domain/workspace/components/update-workspace.modal";
import { DeleteWorkspaceMemberModal } from "@/domain/workspace-member/components/delete-workspace-member-modal";
import { UpdateWorkspaceMemberModal } from "@/domain/workspace-member/components/update-workspace-member-modal";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { CreateCredentialModal } from "@/shared/components/modal/create-credential-modal";
import { ViewRejectReasonModal } from "@/shared/components/modal/view-reject-reason-modal";
import { ViewRequestReasonModal } from "@/shared/components/modal/view-request-reason-modal";
import { CreateResourceSettingModal } from "./create-request-resource-modal";
import { SettingMainSection } from "./setting-main-section";
import { SettingSubSection } from "./setting-sub-section";
import { UpdateNotificationSettingModal } from "./update-notification-setting-modal";

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
      {/* 알림설정 모달 */}
      <UpdateNotificationSettingModal />
      {/* 크레덴셜 추가 모달 */}
      <CreateCredentialModal />
    </>
  );
}
