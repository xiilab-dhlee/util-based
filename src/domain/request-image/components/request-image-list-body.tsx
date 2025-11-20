"use client";

import { useAtomValue } from "jotai";

import { useGetRequestImages } from "@/domain/request-image/hooks/use-get-request-images";
import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/domain/request-image/state/request-image.atom";
import { createRequestImageColumn } from "@/shared/components/column/create-request-image-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 이미지 요청 목록 페이지 본문 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 이미지 요청 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 이미지 요청 목록 페이지 본문 컴포넌트
 */
export function RequestImageListBody() {
  // 페이지 번호
  const page = useAtomValue(requestImagePageAtom);
  // 검색어
  const searchText = useAtomValue(requestImageSearchTextAtom);

  const { data } = useGetRequestImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestImageColumn()}
        data={data?.content || []}
        activePadding
        columnHeight={40}
      />
    </ListWrapper>
  );
}
