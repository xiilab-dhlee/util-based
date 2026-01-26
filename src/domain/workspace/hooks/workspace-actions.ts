import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "react-toastify";

import {
  getGetAdminAllWorkspacesQueryKey,
  getGetAdminWorkspaceDetailQueryKey,
  useDeleteWorkspaces,
} from "@/api/generated/admin-workspace/admin-workspace";
import {
  getGetAllWorkspacesQueryKey,
  getGetResourceRequestsQueryKey,
  getGetWorkspaceDetailQueryKey,
  useCancelResourceRequest,
  useCreateWorkspace,
  useDeleteWorkspace,
  useSetDefaultWorkspace,
  useUpdateWorkspace,
} from "@/api/generated/workspace/workspace";
import {
  getGetWorkspaceMemberRoleQueryKey,
  getGetWorkspaceMembersQueryKey,
  useAddWorkspaceMembers,
  useDeleteWorkspaceMembers,
  useLeaveWorkspace,
  useUpdateMemberRole,
} from "@/api/generated/workspace-member/workspace-member";
import { WORKSPACE_ERROR_CODES } from "@/domain/workspace/constants/workspace-error-code.constant";
import { useWorkspaceSwitch } from "@/domain/workspace/hooks/use-workspace-switch";
import {
  openLeaveWorkspaceModalAtom,
  openOwnerTransferRequiredModalAtom,
  workspaceCheckedListAtom,
  workspacePageAtom,
} from "@/domain/workspace/state/workspace.atom";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getBackendErrorMessage } from "@/shared/utils/error/error.util";
import { clearStoredWorkspaceId } from "@/shared/utils/storage/workspace-session-storage.util";

export function useCreateWorkspaceAction(
  options?: Parameters<typeof useCreateWorkspace>[0],
) {
  const { handleSelectWorkspace } = useWorkspaceSwitch();

  return useCreateWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, ...rest) => {
        if (data) {
          handleSelectWorkspace(data);
        }
        options?.mutation?.onSuccess?.(data, ...rest);
      },
    },
  });
}

export function useUpdateWorkspaceAction(
  options?: Parameters<typeof useUpdateWorkspace>[0],
) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const setSelectedWorkspace = useSetAtom(selectedWorkspaceAtom);

  return useUpdateWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        if (data && variables.workspaceId === selectedWorkspace?.workspaceId) {
          setSelectedWorkspace(data);
        }
        queryClient.invalidateQueries({
          queryKey: getGetAllWorkspacesQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetAdminAllWorkspacesQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceDetailQueryKey(variables.workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetAdminWorkspaceDetailQueryKey(variables.workspaceId),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useDeleteWorkspaceAction(
  options?: Parameters<typeof useDeleteWorkspace>[0],
) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const setSelectedWorkspace = useSetAtom(selectedWorkspaceAtom);

  return useDeleteWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        if (variables.workspaceId === selectedWorkspace?.workspaceId) {
          clearStoredWorkspaceId();
          setSelectedWorkspace(null);
        }
        queryClient.invalidateQueries({
          queryKey: getGetAllWorkspacesQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetAdminAllWorkspacesQueryKey(),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useLeaveWorkspaceAction(
  options?: Parameters<typeof useLeaveWorkspace>[0],
) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const setSelectedWorkspace = useSetAtom(selectedWorkspaceAtom);
  const setOpenLeaveWorkspaceModal = useSetAtom(openLeaveWorkspaceModalAtom);
  const setOpenOwnerTransferModal = useSetAtom(
    openOwnerTransferRequiredModalAtom,
  );

  return useLeaveWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      meta: { showToastOnError: false },
      onSuccess: (data, variables, ...rest) => {
        if (variables.workspaceId === selectedWorkspace?.workspaceId) {
          clearStoredWorkspaceId();
          setSelectedWorkspace(null);
        }

        queryClient.invalidateQueries({
          queryKey: getGetAllWorkspacesQueryKey(),
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
      onError: (error, variables, ...rest) => {
        if (isAxiosError(error)) {
          const errorCode = error.response?.data?.errorCode;
          if (
            error.response?.status === 403 &&
            errorCode === WORKSPACE_ERROR_CODES.CANNOT_LEAVE_AS_ONLY_OWNER
          ) {
            setOpenLeaveWorkspaceModal(false);
            setOpenOwnerTransferModal(true);
            options?.mutation?.onError?.(error, variables, ...rest);
            return;
          }
        }
        // 다른 에러는 토스트 띄우기
        toast.error(getBackendErrorMessage(error));
        options?.mutation?.onError?.(error, variables, ...rest);
      },
    },
  });
}

export function useSetDefaultWorkspaceAction(
  options?: Parameters<typeof useSetDefaultWorkspace>[0],
) {
  const queryClient = useQueryClient();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const setSelectedWorkspace = useSetAtom(selectedWorkspaceAtom);

  return useSetDefaultWorkspace({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        // 선택된 워크스페이스의 Default 뱃지를 즉시 반영
        if (selectedWorkspace?.workspaceId === variables.workspaceId) {
          setSelectedWorkspace({
            ...selectedWorkspace,
            isDefault: variables.data.isDefault,
          });
        }

        queryClient.invalidateQueries({
          queryKey: getGetAllWorkspacesQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceDetailQueryKey(variables.workspaceId),
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useAddWorkspaceMembersAction(
  options?: Parameters<typeof useAddWorkspaceMembers>[0],
) {
  const queryClient = useQueryClient();

  return useAddWorkspaceMembers({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceMembersQueryKey(variables.workspaceId),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useDeleteWorkspaceMembersAction(
  options?: Parameters<typeof useDeleteWorkspaceMembers>[0],
) {
  const queryClient = useQueryClient();

  return useDeleteWorkspaceMembers({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceMembersQueryKey(variables.workspaceId),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useUpdateMemberRoleAction(
  options?: Parameters<typeof useUpdateMemberRole>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateMemberRole({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceMembersQueryKey(variables.workspaceId),
        });
        queryClient.invalidateQueries({
          queryKey: getGetWorkspaceMemberRoleQueryKey(
            variables.workspaceId,
            variables.accountId,
          ),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useCancelResourceRequestAction(
  options?: Parameters<typeof useCancelResourceRequest>[0],
) {
  const queryClient = useQueryClient();

  return useCancelResourceRequest({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        queryClient.invalidateQueries({
          queryKey: getGetResourceRequestsQueryKey(variables.workspaceId),
        });
        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}

export function useDeleteAdminWorkspacesAction(
  options?: Parameters<typeof useDeleteWorkspaces>[0],
) {
  const queryClient = useQueryClient();
  const resetPage = useResetAtom(workspacePageAtom);
  const resetCheckedList = useResetAtom(workspaceCheckedListAtom);

  return useDeleteWorkspaces({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (data, variables, ...rest) => {
        resetCheckedList();
        resetPage();

        queryClient.invalidateQueries({
          queryKey: getGetAdminAllWorkspacesQueryKey(),
        });

        // 삭제된 각 워크스페이스의 상세 정보도 무효화
        variables.data.workspaceId.forEach((workspaceId) => {
          queryClient.invalidateQueries({
            queryKey: getGetAdminWorkspaceDetailQueryKey(workspaceId),
          });
        });

        options?.mutation?.onSuccess?.(data, variables, ...rest);
      },
    },
  });
}
