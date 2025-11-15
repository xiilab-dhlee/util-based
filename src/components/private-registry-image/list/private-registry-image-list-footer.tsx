"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  privateRegistryImagePageAtom,
  privateRegistryImageSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistryImages } from "@/hooks/private-registry-image/use-get-private-registry-images";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 내부 레지스트리 이미지 목록 페이지 하단 푸터 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 페이지 번호 및 검색어를 관리하고,
 * 총 내부 레지스트리 이미지 수를 표시하는 푸터 컴포넌트입니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 하단 푸터 컴포넌트
 */
export function PrivateRegistryImageListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(privateRegistryImagePageAtom);
  // 검색어
  const searchText = useAtomValue(privateRegistryImageSearchTextAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetPrivateRegistryImages({
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
