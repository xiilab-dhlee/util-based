"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Button } from "xiilab-ui";

import type { SignupRequestItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  accountPendingCheckedListAtom,
  accountPendingSearchTextAtom,
} from "@/domain/account-management/state/account.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ACCOUNT_EVENTS } from "@/shared/constants/pubsub.constant";
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

  return (
    <MySearchFilter title="가입 승인 목록" total={totalSize}>
      <SearchInput onSearch={setSearchText} />
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
