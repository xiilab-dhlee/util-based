import { useQueryClient } from "@tanstack/react-query";
import { useResetAtom } from "jotai/utils";

import {
  getGetPresetDetailQueryKey,
  getGetPresetsQueryKey,
  useCreatePreset,
  useDeletePresets,
  useUpdatePreset,
} from "@/api/generated/admin-resource-preset/admin-resource-preset";
import {
  resourcePresetCheckedListAtom,
  resourcePresetJobTypeAtom,
  resourcePresetNodeTypeAtom,
  resourcePresetOrderAtom,
  resourcePresetPageAtom,
  resourcePresetSearchTextAtom,
  resourcePresetSortAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";

export function useCreatePresetAction(
  options?: Parameters<typeof useCreatePreset>[0],
) {
  const queryClient = useQueryClient();
  const resetPage = useResetAtom(resourcePresetPageAtom);
  const resetSearchText = useResetAtom(resourcePresetSearchTextAtom);
  const resetJobType = useResetAtom(resourcePresetJobTypeAtom);
  const resetNodeType = useResetAtom(resourcePresetNodeTypeAtom);
  const resetSort = useResetAtom(resourcePresetSortAtom);
  const resetOrder = useResetAtom(resourcePresetOrderAtom);
  const resetCheckedList = useResetAtom(resourcePresetCheckedListAtom);

  return useCreatePreset({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        resetCheckedList();
        resetPage();
        resetSearchText();
        resetJobType();
        resetNodeType();
        resetSort();
        resetOrder();

        queryClient.invalidateQueries({
          queryKey: getGetPresetsQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useDeletePresetsAction(
  options?: Parameters<typeof useDeletePresets>[0],
) {
  const queryClient = useQueryClient();
  const resetCheckedList = useResetAtom(resourcePresetCheckedListAtom);

  return useDeletePresets({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        resetCheckedList();

        queryClient.invalidateQueries({
          queryKey: getGetPresetsQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useUpdatePresetAction(
  options?: Parameters<typeof useUpdatePreset>[0],
) {
  const queryClient = useQueryClient();

  return useUpdatePreset({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetPresetsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPresetDetailQueryKey(variables.resourcePresetId),
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}
