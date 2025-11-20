"use client";

import { DeleteWorkspaceMemberModal } from "./delete-workspace-member-modal";
import { UpdateWorkspaceMemberModal } from "./update-workspace-member-modal";
import { WorkspaceMemberBody } from "./workspace-member-body";
import { WorkspaceMemberFilter } from "./workspace-member-filter";
import { WorkspaceMemberFooter } from "./workspace-member-footer";

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
