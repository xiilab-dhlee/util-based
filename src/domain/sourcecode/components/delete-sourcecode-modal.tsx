"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "xiilab-ui";

import { getAdminGetSourceCodeListQueryKey } from "@/api/generated/admin-sourcecode/admin-sourcecode";
import { getGetSourceCodeListQueryKey } from "@/api/generated/source-code/source-code";
import { useDeleteSourcecodeByMode } from "@/domain/sourcecode/hooks/use-delete-sourcecode-by-mode";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";

interface DeleteSourcecodeModalProps {
  mode: SourcecodeMode;
}

/**
 * 소스코드 삭제 모달 컴포넌트
 *
 * 선택한 소스코드를 삭제할 수 있는 모달입니다.
 * 다중 삭제 API를 사용하여 한 번의 요청으로 여러 소스코드를 삭제합니다.
 * 삭제 완료 시 목록을 자동으로 갱신합니다.
 */
export function DeleteSourcecodeModal({ mode }: DeleteSourcecodeModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deleteSourcecodeIds, setDeleteSourcecodeIds] = useState<number[]>([]);

  const isUser = mode === "user";
  const { mutate, isPending } = useDeleteSourcecodeByMode(mode);

  const handleOk = () => {
    if (isPending) return;
    if (deleteSourcecodeIds.length === 0) return;

    mutate(
      { data: { sourceCodeIds: deleteSourcecodeIds } },
      {
        onSuccess: () => {
          if (isUser) {
            queryClient.invalidateQueries({
              queryKey: getGetSourceCodeListQueryKey(),
            });
            router.replace(ROUTES.USER_SOURCECODE);
          } else {
            queryClient.invalidateQueries({
              queryKey: getAdminGetSourceCodeListQueryKey(),
            });
            router.replace(ROUTES.ADMIN_SOURCECODE);
          }
          setOpen(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<number[]>(SOURCECODE_EVENTS.openDeleteModal, (ids) => {
    setDeleteSourcecodeIds(ids);
    setOpen(true);
  });

  return (
    <Modal
      variant="delete"
      modalWidth={300}
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      title="소스코드 삭제"
      centered
      closable={!isPending}
      maskClosable={!isPending}
      keyboard={!isPending}
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 소스코드를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 소스코드는 복구되지 않습니다.</div>
    </Modal>
  );
}
