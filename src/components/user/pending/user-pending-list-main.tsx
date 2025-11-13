"use client";

import { ListPageBody } from "@/styles/layers/list-page-layers.styled";
import UserPendingListBody from "./user-pending-list-body";
import UserPendingListFilter from "./user-pending-list-filter";
import UserPendingListFooter from "./user-pending-list-footer";

/**
 * 사용자 승인 목록 페이지의 메인 컴포넌트
 *
 */
export function UserPendingListMain() {
  return (
    <>
      <ListPageBody>
        {/* 사용자 목록 필터 */}
        <UserPendingListFilter />
        {/* 사용자 목록 본문 */}
        <UserPendingListBody />
        {/* 사용자 목록 페이지네이션 */}
        <UserPendingListFooter />
      </ListPageBody>
    </>
  );
}

