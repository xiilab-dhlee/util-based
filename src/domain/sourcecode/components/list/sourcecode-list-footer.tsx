"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "react-toastify";

import { SOURCECODE_PAGE_SIZE } from "@/domain/sourcecode/constants/sourcecode.constant";
import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SourcecodeListFooterProps {
  total: number;
  loading: boolean;
}

export function SourcecodeListFooter({
  total,
  loading,
}: SourcecodeListFooterProps) {
  const publish = usePublish();

  const [page, setPage] = useAtom(sourcecodePageAtom);
  const checkedList = useAtomValue(sourcecodeCheckedListAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    resetCheckedList();
  };

  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 소스코드를 선택해 주세요.");
      return;
    }

    publish(
      SOURCECODE_EVENTS.openDeleteModal,
      Array.from(checkedList).map(Number),
    );
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={SOURCECODE_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={loading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={checkedList.size === 0}
        />
      }
    />
  );
}
