import { useQueryClient } from "@tanstack/react-query";
import { useResetAtom } from "jotai/utils";

import {
  getGetAdminActiveWorkloadsQueryKey,
  getGetAdminTerminatedWorkloadsQueryKey,
} from "@/api/generated/admin-workspace/admin-workspace";
import {
  getGetActiveWorkloadsQueryKey,
  getGetTerminatedWorkloadsQueryKey,
  getGetWorkloadDetailQueryKey,
  useCreateWorkload,
  useDeleteWorkload,
  useRestartWorkload,
  useTerminateWorkload,
  useUpdateResourcePreset,
  useUpdateWorkload,
} from "@/api/generated/workload/workload";
import {
  activeWorkloadPageAtom,
  disabledWorkloadPageAtom,
} from "@/domain/workload/state/workload.atom";

const invalidateWorkloadDetailAndLists = ({
  queryClient,
  workspaceId,
  workloadResourceName,
}: {
  queryClient: ReturnType<typeof useQueryClient>;
  workspaceId: number;
  workloadResourceName: string;
}) => {
  queryClient.invalidateQueries({
    queryKey: getGetWorkloadDetailQueryKey(workspaceId, workloadResourceName),
  });

  queryClient.invalidateQueries({
    queryKey: getGetActiveWorkloadsQueryKey(workspaceId),
  });
  queryClient.invalidateQueries({
    queryKey: getGetTerminatedWorkloadsQueryKey(workspaceId),
  });
  queryClient.invalidateQueries({
    queryKey: getGetAdminActiveWorkloadsQueryKey(workspaceId),
  });
  queryClient.invalidateQueries({
    queryKey: getGetAdminTerminatedWorkloadsQueryKey(workspaceId),
  });
};

/**
 * 워크로드 생성 액션 훅
 * - 생성 성공 시 활성화 워크로드 목록 무효화
 * - 성공 토스트 메시지 표시
 */
export function useCreateWorkloadAction(
  options?: Parameters<typeof useCreateWorkload>[0],
) {
  const queryClient = useQueryClient();

  return useCreateWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          queryClient.invalidateQueries({
            queryKey: getGetActiveWorkloadsQueryKey(variables.workspaceId),
          });
          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}

/**
 * 워크로드 상세 수정 액션 훅
 * - 성공 시 상세 무효화
 */
export function useUpdateWorkloadAction(
  options?: Parameters<typeof useUpdateWorkload>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          invalidateWorkloadDetailAndLists({
            queryClient,
            workspaceId: variables.workspaceId,
            workloadResourceName: variables.workloadResourceName,
          });
          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}

/**
 * 워크로드 리소스 프리셋 변경 액션 훅
 * - 성공 시 상세 무효화
 * - 해당 페이지가 있으면 목록 무효화
 */
export function useUpdateResourcePresetAction(
  options?: Parameters<typeof useUpdateResourcePreset>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateResourcePreset(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          invalidateWorkloadDetailAndLists({
            queryClient,
            workspaceId: variables.workspaceId,
            workloadResourceName: variables.workloadResourceName,
          });
          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}

/**
 * 워크로드 재시작 액션 훅
 * - 성공 시 상세 무효화
 * - 해당 페이지가 있으면 목록 무효화
 */
export function useRestartWorkloadAction(
  options?: Parameters<typeof useRestartWorkload>[0],
) {
  const queryClient = useQueryClient();

  return useRestartWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          invalidateWorkloadDetailAndLists({
            queryClient,
            workspaceId: variables.workspaceId,
            workloadResourceName: variables.workloadResourceName,
          });
          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}

/**
 * 워크로드 종료 액션 훅
 * - 성공 시 상세 무효화
 * - 해당 페이지가 있으면 목록 무효화
 * - 활성화/비활성화 목록 페이지네이션 리셋
 */
export function useTerminateWorkloadAction(
  options?: Parameters<typeof useTerminateWorkload>[0],
) {
  const queryClient = useQueryClient();
  const resetActivePage = useResetAtom(activeWorkloadPageAtom);
  const resetDisabledPage = useResetAtom(disabledWorkloadPageAtom);

  return useTerminateWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          invalidateWorkloadDetailAndLists({
            queryClient,
            workspaceId: variables.workspaceId,
            workloadResourceName: variables.workloadResourceName,
          });

          // 페이지네이션 리셋
          resetActivePage();
          resetDisabledPage();

          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}

/**
 * 워크로드 삭제 액션 훅
 * - 성공 시 상세 무효화
 * - 해당 페이지가 있으면 목록 무효화
 * - 활성화/비활성화 목록 페이지네이션 리셋
 */
export function useDeleteWorkloadAction(
  options?: Parameters<typeof useDeleteWorkload>[0],
) {
  const queryClient = useQueryClient();
  const resetActivePage = useResetAtom(activeWorkloadPageAtom);
  const resetDisabledPage = useResetAtom(disabledWorkloadPageAtom);

  return useDeleteWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          invalidateWorkloadDetailAndLists({
            queryClient,
            workspaceId: variables.workspaceId,
            workloadResourceName: variables.workloadResourceName,
          });

          // 페이지네이션 리셋
          resetActivePage();
          resetDisabledPage();

          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}
