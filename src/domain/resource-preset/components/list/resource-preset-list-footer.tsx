"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";

import {
  resourcePresetCheckedListAtom,
  resourcePresetPageAtom,
} from "@/domain/resource-preset/state/resource-preset.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface ResourcePresetListFooterProps {
  /** 전체 개수 */
  total: number;
  /** 로딩 상태 */
  isLoading: boolean;
}

/**
 * 자원 프리셋 목록 페이지 하단 푸터 컴포넌트
 *
 * 페이지네이션을 제공합니다.
 */
export function ResourcePresetListFooter({
  total,
  isLoading,
}: ResourcePresetListFooterProps) {
  const [page, setPage] = useAtom(resourcePresetPageAtom);
  const resetCheckedList = useResetAtom(resourcePresetCheckedListAtom);

  /**
   * 페이지 변경 핸들러
   * @param newPage - 변경할 페이지 번호
   */
  const handlePageChange = (newPage: number) => {
    resetCheckedList();
    setPage(newPage);
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePageChange}
      isLoading={isLoading}
    />
  );
}
