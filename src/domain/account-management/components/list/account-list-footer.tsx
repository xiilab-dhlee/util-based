"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import { useGetAccounts } from "@/domain/account-management/hooks/use-get-accounts";
import {
  accountCheckedListAtom,
  accountPageAtom,
  accountSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

/**
 * 사용자 목록 페이지 하단 푸터 컴포넌트
 *
 * 사용자 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 사용자 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 사용자 목록 페이지 하단 푸터 컴포넌트
 */
export function AccountListFooter() {
  const publish = usePublish();
  // 페이지 번호
  const [page, setPage] = useAtom(accountPageAtom);
  // 검색어
  const searchText = useAtomValue(accountSearchTextAtom);
  // 체크된 사용자 목록
  const selectedAccounts = useAtomValue(accountCheckedListAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    // 삭제할 사용자가 없으면 에러 메시지 표시
    if (selectedAccounts.size === 0) {
      toast.error("삭제할 사용자를 선택해 주세요.");
      return;
    }
    // 사용자 삭제 모달에 데이터 전달
    publish(ACCOUNT_EVENTS.sendDeleteAccount, Array.from(selectedAccounts));
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}
