"use client";

import { ListPageBody } from "@/styles/layers/list-page-layers.styled";
import { AccountListBody } from "./account-list-body";
import { AccountListFilter } from "./account-list-filter";
import { AccountListFooter } from "./account-list-footer";
import { UpdateAccountModal } from "./update-account-modal";

/**
 * 사용자 목록 페이지의 메인 컴포넌트
 *
 */
export function AccountListMain() {
  return (
    <>
      <ListPageBody>
        {/* 사용자 목록 필터 */}
        <AccountListFilter />
        {/* 사용자 목록 본문 */}
        <AccountListBody />
        {/* 사용자 목록 페이지네이션 */}
        <AccountListFooter />
      </ListPageBody>
      {/* 멤버 상세 모달 */}
      {/* <MemberDetailModal /> */}
      {/* 사용자 정보 수정 모달 */}
      <UpdateAccountModal />
    </>
  );
}
