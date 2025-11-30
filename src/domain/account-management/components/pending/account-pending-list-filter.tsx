"use client";

import { useAtomValue } from "jotai";
import { Button } from "xiilab-ui";

import { useGetPendingAccounts } from "@/domain/account-management/hooks/use-get-pending-accounts";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { useSearch } from "@/shared/hooks/use-search";

interface CheckedAccounts {
  ids: AccountListType["id"][];
  names: AccountListType["name"][];
}

/**
 * 사용자 목록 페이지 상단 필터 컴포넌트
 *
 * 사용자 목록 페이지에서 검색어 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @returns 사용자 목록 페이지 상단 필터 컴포넌트
 */
export function AccountPendingListFilter() {
  // 공통 검색 훅 사용
  const { onSubmit } = useSearch(accountPendingSearchTextAtom);

  const page = useAtomValue(accountPendingPageAtom);
  const searchText = useAtomValue(accountPendingSearchTextAtom);
  const checkedList = useAtomValue(accountPendingCheckedListAtom);

  const publish = usePublish();

  const { data, isLoading } = useGetPendingAccounts({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 체크된 계정이 있는지 확인
  const hasChecked = checkedList.size > 0;

  // 체크된 계정 정보 가져오기
  const getCheckedAccounts = (): CheckedAccounts => {
    if (!data?.content) {
      return { ids: [], names: [] };
    }

    const accounts = data.content.filter((account: AccountListType) =>
      checkedList.has(account.id),
    );

    return {
      ids: accounts.map((account: AccountListType) => account.id),
      names: accounts.map((account: AccountListType) => account.name),
    };
  };

  /**
   * 반려 버튼 클릭 핸들러
   */
  const handleReject = () => {
    const { ids, names } = getCheckedAccounts();

    publish(ACCOUNT_EVENTS.sendRejectAccountPending, {
      accountIds: ids,
      accountNames: names,
    });
  };

  /**
   * 승인 버튼 클릭 핸들러
   */
  const handleApprove = () => {
    const { ids, names } = getCheckedAccounts();

    publish(ACCOUNT_EVENTS.sendApproveAccountPending, {
      accountIds: ids,
      accountNames: names,
    });
  };

  return (
    <MySearchFilter title="가입 승인 목록" total={data?.totalSize}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        variant="gradient"
        icon="Close"
        iconPosition="left"
        width={70}
        height={30}
        onClick={handleReject}
        disabled={!hasChecked || isLoading}
      >
        반려
      </Button>
      <Button
        color="primary"
        variant="gradient"
        icon="Check"
        iconPosition="left"
        width={70}
        height={30}
        onClick={handleApprove}
        disabled={!hasChecked || isLoading}
      >
        승인
      </Button>
    </MySearchFilter>
  );
}
