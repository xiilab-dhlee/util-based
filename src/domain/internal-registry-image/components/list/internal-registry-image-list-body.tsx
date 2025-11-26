"use client";

import { useAtomValue } from "jotai";

import { useGetInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-images";
import {
  internalregistryImagePageAtom,
  internalregistryImageSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { createInternalRegistryImageColumn } from "@/shared/components/column/create-internal-registry-image-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 내부 레지스트리 이미지 목록 페이지 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 내부 레지스트리 이미지 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 본문 컴포넌트
 */
export function InternalRegistryImageListBody() {
  // 페이지 번호
  const page = useAtomValue(internalregistryImagePageAtom);
  // 검색어
  const searchText = useAtomValue(internalregistryImageSearchTextAtom);

  const { data } = useGetInternalRegistryImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createInternalRegistryImageColumn([
          { dataIndex: "checkbox" },
          {
            dataIndex: "imageName",
            title: "컨테이너 이미지 이름",
          },
          { dataIndex: "tagCnt", title: "최신 태그 / 개수", width: 150 },
          { dataIndex: "pullCount", width: 150 },
          { dataIndex: "creatorName", width: 150 },
          { dataIndex: "creatorDate", width: 150 },
          {
            dataIndex: "description",
            title: "설명",
            width: 300,
            ellipsis: true,
          },
        ])}
        data={data?.content || []}
        columnHeight={40}
      />
    </ListWrapper>
  );
}
