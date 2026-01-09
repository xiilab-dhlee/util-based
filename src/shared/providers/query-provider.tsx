import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  type QueryKey,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";

import { isMutationKey } from "@/api/generated/mutation-keys";
import { MUTATION_MESSAGES } from "@/api/toast-messages";
import { getBackendErrorMessage } from "@/shared/utils/error/error.util";

const handleQueryError = (
  error: unknown,
  query: { queryKey: QueryKey; meta?: { showToastOnError?: boolean } },
) => {
  const { meta } = query;

  if (meta?.showToastOnError === true) {
    const errorMessage = getBackendErrorMessage(error);
    toast.error(errorMessage);
  }
};

const handleMutationSuccess = (mutation: {
  options: { mutationKey?: readonly unknown[] };
  meta?: { showToastOnSuccess?: boolean };
}) => {
  const mutationKey = mutation.options.mutationKey;

  if (!mutationKey?.length) return;

  const key = mutationKey[0];
  if (!isMutationKey(key)) return;

  const messages = MUTATION_MESSAGES[key];

  if (messages?.success && mutation.meta?.showToastOnSuccess !== false) {
    toast.success(messages.success);
  }
};

const handleMutationError = (
  error: unknown,
  mutation: {
    options: { mutationKey?: readonly unknown[] };
    meta?: { showToastOnError?: boolean };
  },
) => {
  if (mutation.meta?.showToastOnError !== false) {
    const errorMessage = getBackendErrorMessage(error);
    toast.error(errorMessage);
  }
};

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: process.env.NODE_ENV === "test" ? false : 3,
        staleTime: 3 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
    queryCache: new QueryCache({
      onError: handleQueryError,
    }),
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) =>
        handleMutationSuccess(mutation),
      onError: (error, _variables, _context, mutation) =>
        handleMutationError(error, mutation),
    }),
  });

export function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
