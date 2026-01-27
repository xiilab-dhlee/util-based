"use client";

import { useAtom, useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { toast } from "react-toastify";

import {
  resourcePresetCheckedListAtom,
  resourcePresetPageAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { RESOURCE_PRESET_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface ResourcePresetListFooterProps {
  /** 전체 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 리소스 프리셋 목록 페이지 하단 푸터 컴포넌트
 *
 * 페이지네이션을 제공합니다.
 */
export function ResourcePresetListFooter({
  total,
  isLoading,
}: ResourcePresetListFooterProps) {
  const publish = usePublish();
  const [page, setPage] = useAtom(resourcePresetPageAtom);
  const resetCheckedList = useResetAtom(resourcePresetCheckedListAtom);
  const checkedList = useAtomValue(resourcePresetCheckedListAtom);

  /**
   * 페이지 변경 핸들러
   * @param newPage - 변경할 페이지 번호
   */
  const handlePageChange = (newPage: number) => {
    resetCheckedList();
    setPage(newPage);
  };

  const handleClickDelete = () => {
    if (checkedList.size === 0) {
      toast.error("삭제할 리소스 프리셋을 선택해 주세요.");
      return;
    }

    const selectedIds = Array.from(checkedList).map(Number);
    publish(RESOURCE_PRESET_EVENTS.sendDeleteResourcePreset, selectedIds);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
      rightChildren={
        <ListDeleteButton
          onClick={handleClickDelete}
          disabled={checkedList.size === 0}
          isLoading={isLoading}
        />
      }
    />
  );
}
