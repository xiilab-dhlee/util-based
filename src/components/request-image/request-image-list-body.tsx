"use client";

import { useAtomValue } from "jotai";

import {
  requestImagePageAtom,
  requestImageSearchTextAtom,
} from "@/atoms/request-image/request-image-list.atom";
import { CustomizedTable } from "@/components/common/table/customized-table";
import requestImageListConstants from "@/constants/request-image/request-image-list.constant";
import { useGetRequestImages } from "@/hooks/request-image/use-get-request-images";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { createRequestImageColumn } from "../common/columns/create-request-image-column";

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
    size: requestImageListConstants.pageSize,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestImageColumn()}
        data={data?.content || []}
        activePadding
      />
    </ListWrapper>
  );
}
