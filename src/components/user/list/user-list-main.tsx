"use client";

// import { MemberDetailModal } from "@/components/setting/modal/member-detail-modal";
import { ListPageBody } from "@/styles/layers/list-page-layers.styled";
import { UpdateUserModal } from "./update-user-modal";
import { UserListBody } from "./user-list-body";
import { UserListFilter } from "./user-list-filter";
import { UserListFooter } from "./user-list-footer";

/**
 * 사용자 목록 페이지의 메인 컴포넌트
 *
 */
export function UserListMain() {
  return (
    <>
      <ListPageBody>
        {/* 사용자 목록 필터 */}
        <UserListFilter />
        {/* 사용자 목록 본문 */}
        <UserListBody />
        {/* 사용자 목록 페이지네이션 */}
        <UserListFooter />
      </ListPageBody>
      {/* 멤버 상세 모달 */}
      {/* <MemberDetailModal /> */}
      {/* 사용자 정보 수정 모달 */}
      <UpdateUserModal />
    </>
  );
}
