"use client";

import { useAtom, useAtomValue } from "jotai";

import { useGetRequestImages } from "@/domain/request-image/hooks/use-get-request-images";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/domain/request-image/state/request-image.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListPageFooter } from "@/shared/layouts/list/list-page-footer";

/**
 * 이미지 요청 목록 페이지 하단 푸터 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 이미지 요청 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 이미지 요청 목록 페이지 하단 푸터 컴포넌트
 */
export function RequestImageListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(requestImagePageAtom);
  // 검색어
  const searchText = useAtomValue(requestImageSearchTextAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetRequestImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
