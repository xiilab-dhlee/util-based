"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Input } from "xiilab-ui";

import type { SignupRequestItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
  accountPendingSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
import {
  ACCOUNT_PENDING_SELECTOR,
  SELECTOR,
} from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface CheckedAccounts {
  ids: string[];
  names: string[];
}

interface AccountPendingListFilterProps {
  totalSize?: number;
  data: SignupRequestItemResponse[];
  isLoading: boolean;
}

export function AccountPendingListFilter({
  totalSize,
  data,
  isLoading,
}: AccountPendingListFilterProps) {
  const setSearchText = useSetAtom(accountPendingSearchTextAtom);
  const checkedList = useAtomValue(accountPendingCheckedListAtom);
  const resetPage = useResetAtom(accountPendingPageAtom);
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);
  const publish = usePublish();

  const hasChecked = checkedList.size > 0;

  const getCheckedAccounts = (): CheckedAccounts => {
    const accounts = data.filter((account: SignupRequestItemResponse) =>
      checkedList.has(account.accountId),
    );

    return {
      ids: accounts.map(
        (account: SignupRequestItemResponse) => account.accountId,
      ),
      names: accounts.map(
        (account: SignupRequestItemResponse) => account.accountName,
      ),
    };
  };

  const handleReject = () => {
    const { ids, names } = getCheckedAccounts();

    publish(ACCOUNT_EVENTS.sendRejectAccountPending, {
      accountIds: ids,
      accountNames: names,
    });
  };

  const handleApprove = () => {
    const { ids, names } = getCheckedAccounts();

    publish(ACCOUNT_EVENTS.sendApproveAccountPending, {
      accountIds: ids,
      accountNames: names,
    });
  };

  const handleSearch = (value: string) => {
    resetCheckedList();
    resetPage();
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter
      title="가입 승인 목록"
      total={totalSize}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
      <Button
        color="primary"
        variant="gradient"
        icon="Close"
        iconPosition="left"
        width={70}
        height={30}
        onClick={handleReject}
        disabled={!hasChecked || isLoading}
        data-testid={ACCOUNT_PENDING_SELECTOR.FILTER_REJECT_BUTTON}
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
        data-testid={ACCOUNT_PENDING_SELECTOR.FILTER_APPROVE_BUTTON}
      >
        승인
      </Button>
    </MySearchFilter>
  );
}
