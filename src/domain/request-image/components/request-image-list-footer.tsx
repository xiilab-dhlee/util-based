"use client";

import { useAtom } from "jotai";

import { requestImagePageAtom } from "@/domain/request-image/state/request-image.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

interface RequestImageListFooterProps {
  /** 전체 요청 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 이미지 요청 목록 페이지 하단 푸터 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 페이지 번호를 관리하고,
 * 총 이미지 요청 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @param total - 전체 요청 수
 * @param loading - 로딩 상태
 * @returns 이미지 요청 목록 페이지 하단 푸터 컴포넌트
 */
export function RequestImageListFooter({
  total,
  loading,
}: RequestImageListFooterProps) {
  const [page, setPage] = useAtom(requestImagePageAtom);

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={setPage}
      isLoading={loading}
    />
  );
}
