"use client";

import { ListPageBody } from "@/styles/layers/list-page-layers.styled";
import { AccountPendingListBody } from "./account-pending-list-body";
import { AccountPendingListFilter } from "./account-pending-list-filter";
import { AccountPendingListFooter } from "./account-pending-list-footer";
import { ApproveAccountPendingModal } from "./approve-account-pending-modal";
import { RejectAccountPendingModal } from "./reject-account-pending-modal";

/**
 * 사용자 승인 목록 페이지의 메인 컴포넌트
 *
 */
export function AccountPendingListMain() {
  return (
    <>
      <ListPageBody>
        {/* 사용자 목록 필터 */}
        <AccountPendingListFilter />
        {/* 사용자 목록 본문 */}
        <AccountPendingListBody />
        {/* 사용자 목록 페이지네이션 */}
        <AccountPendingListFooter />
      </ListPageBody>
      {/* 가입 승인 확인 모달 */}
      <ApproveAccountPendingModal />
      {/* 가입 반려 확인 모달 */}
      <RejectAccountPendingModal />
    </>
  );
}
