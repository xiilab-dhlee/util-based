import { atom } from "jotai";
import { atomWithReset } from "jotai/utils";
import type { Key } from "react";

import type {
  AccountSortState,
  SignupRequestSortState,
} from "@/domain/account-management/constants/account.constant";

export const accountPageAtom = atomWithReset<number>(1);
export const accountSearchTextAtom = atom<string>("");
export const accountSortAtom = atom<AccountSortState>({
  field: "accountName",
  order: "ascend",
});
export const accountCheckedListAtom = atomWithReset<Set<Key>>(new Set());
export const openUpdateAccountModalAtom = atom<boolean>(false);
export const openDeleteAccountModalAtom = atom<boolean>(false);
export const accountPendingPageAtom = atomWithReset<number>(1);
export const accountPendingSearchTextAtom = atom<string>("");
export const accountPendingSortAtom = atom<SignupRequestSortState>({
  field: "createdAt",
  order: "descend",
});
export const accountPendingCheckedListAtom = atomWithReset<Set<Key>>(new Set());
export const openUpdateAccountPendingModalAtom = atom<boolean>(false);
export const openUpdateAccountStatusModalAtom = atom<boolean>(false);
export const openApproveAccountPendingModalAtom = atom<boolean>(false);
export const openRejectAccountPendingModalAtom = atom<boolean>(false);
export const openViewAccountDetailModalAtom = atom<boolean>(false);
export const openResetPasswordConfirmModalAtom = atom<boolean>(false);
export const openResetPasswordResultModalAtom = atom<boolean>(false);
