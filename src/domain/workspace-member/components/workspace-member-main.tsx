"use client";

import { DeleteWorkspaceMemberModal } from "@/domain/workspace-member/components/delete-workspace-member-modal";
import { UpdateWorkspaceMemberModal } from "@/domain/workspace-member/components/update-workspace-member-modal";
import { WorkspaceMemberBody } from "@/domain/workspace-member/components/workspace-member-body";
import { WorkspaceMemberFilter } from "@/domain/workspace-member/components/workspace-member-filter";
import { WorkspaceMemberFooter } from "@/domain/workspace-member/components/workspace-member-footer";

export function WorkspaceMemberMain() {
  return (
    <>
      <WorkspaceMemberFilter />
      <WorkspaceMemberBody />
      <WorkspaceMemberFooter />
      {/* 워크스페이스 멤버 추가 모달 */}
      {/* <MemberAddModal /> */}
      {/* 워크스페이스 멤버 수정 모달 */}
      <UpdateWorkspaceMemberModal />
      {/* 워크스페이스 멤버 삭제 모달 */}
      <DeleteWorkspaceMemberModal />
    </>
  );
}
