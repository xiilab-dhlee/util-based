"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/atoms/request-image/request-image-list.atom";
import requestImageListConstants from "@/constants/request-image/request-image-list.constant";
import { useGetRequestImages } from "@/hooks/request-image/use-get-request-images";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

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
    size: requestImageListConstants.pageSize,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.total || 0}
      page={page}
      pageSize={requestImageListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}

