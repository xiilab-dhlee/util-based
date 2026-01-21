"use client";

import { useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "xiilab-ui";

import {
  getGetSourceCodeListQueryKey,
  useDeleteSourceCode,
} from "@/api/generated/source-code/source-code";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { ROUTES } from "@/shared/constants/routes.constant";
import { useSubscribe } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

/**
 * 소스코드 삭제 모달 컴포넌트
 *
 * 선택한 소스코드를 삭제할 수 있는 모달입니다.
 * 삭제 완료 시 목록을 자동으로 갱신합니다.
 */
export function DeleteSourcecodeModal() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [deleteSourcecodeIds, setDeleteSourcecodeIds] = useState<number[]>([]);

  const { mutateAsync, isPending } = useDeleteSourceCode();

  const isUser = isUserMode(pathname);

  const handleOk = async () => {
    if (isPending) return;
    if (deleteSourcecodeIds.length === 0) return;

    try {
      for (const id of deleteSourcecodeIds) {
        await mutateAsync({ sourceCodeId: id });
      }

      toast.success("소스코드 삭제 완료");

      queryClient.invalidateQueries({
        queryKey: getGetSourceCodeListQueryKey(),
      });

      setOpen(false);

      const targetRoute = isUser
        ? ROUTES.USER_SOURCECODE
        : ROUTES.ADMIN_SOURCECODE_MANAGEMENT;
      router.replace(targetRoute);
    } catch {
      toast.error("소스코드 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (isPending) return;
    setOpen(false);
  };

  useSubscribe<number[]>(SOURCECODE_EVENTS.sendDeleteSourcecode, (ids) => {
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
      okButtonProps={{ loading: isPending }}
      cancelButtonProps={{ disabled: isPending }}
    >
      <div>선택한 소스코드를 삭제하시겠습니까?</div>
      <div>삭제 시 해당 소스코드는 복구되지 않습니다.</div>
    </Modal>
  );
}
