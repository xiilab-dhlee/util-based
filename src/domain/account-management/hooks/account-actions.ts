import { useQueryClient } from "@tanstack/react-query";
import { useResetAtom } from "jotai/utils";

import {
  getGetSignupRequestsQueryKey,
  useApproveSignupRequests,
  useRejectSignupRequests,
} from "@/api/generated/admin-account-approval/admin-account-approval";
import {
  getGetAccountDetailQueryKey,
  getGetAllAccountsQueryKey,
  useDeleteAccountSingle,
  useUpdateAccount,
  useUpdateAccountEnabled,
} from "@/api/generated/admin-account-management/admin-account-management";
import {
  accountPageAtom,
  accountPendingCheckedListAtom,
  accountPendingPageAtom,
} from "@/domain/account-management/state/account.atom";

export function useDeleteAccountAction(
  options?: Parameters<typeof useDeleteAccountSingle>[0],
) {
  const queryClient = useQueryClient();
  const resetPage = useResetAtom(accountPageAtom);

  return useDeleteAccountSingle({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        resetPage();

        queryClient.invalidateQueries({
          queryKey: getGetAllAccountsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetAccountDetailQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

export function useUpdateAccountEnabledAction(
  options?: Parameters<typeof useUpdateAccountEnabled>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateAccountEnabled({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        queryClient.invalidateQueries({
          queryKey: getGetAllAccountsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetAccountDetailQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

export function useUpdateAccountAction(
  options?: Parameters<typeof useUpdateAccount>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateAccount({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        const [, variables] = args;

        queryClient.invalidateQueries({
          queryKey: getGetAllAccountsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetAccountDetailQueryKey(variables.accountId),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

export function useApproveSignupRequestsAction(
  options?: Parameters<typeof useApproveSignupRequests>[0],
) {
  const queryClient = useQueryClient();
  const resetPage = useResetAtom(accountPendingPageAtom);
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  return useApproveSignupRequests({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        resetCheckedList();
        resetPage();

        queryClient.invalidateQueries({
          queryKey: getGetSignupRequestsQueryKey(),
        });

        queryClient.invalidateQueries({
          queryKey: getGetAllAccountsQueryKey(),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

export function useRejectSignupRequestsAction(
  options?: Parameters<typeof useRejectSignupRequests>[0],
) {
  const queryClient = useQueryClient();
  const resetPage = useResetAtom(accountPendingPageAtom);
  const resetCheckedList = useResetAtom(accountPendingCheckedListAtom);

  return useRejectSignupRequests({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        resetCheckedList();
        resetPage();

        queryClient.invalidateQueries({
          queryKey: getGetSignupRequestsQueryKey(),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}
