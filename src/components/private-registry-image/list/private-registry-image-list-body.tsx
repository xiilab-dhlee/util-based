"use client";

import { useAtomValue } from "jotai";

import {
  privateRegistryImagePageAtom,
  privateRegistryImageSearchTextAtom,
} from "@/atoms/private-registry-image.atom";
import { createPrivateRegistryImageColumn } from "@/components/common/column/create-private-registry-image-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistryImages } from "@/hooks/private-registry-image/use-get-private-registry-images";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 내부 레지스트리 이미지 목록 페이지 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 목록 페이지에서 내부 레지스트리 이미지 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 목록 페이지 본문 컴포넌트
 */
export function PrivateRegistryImageListBody() {
  // 페이지 번호
  const page = useAtomValue(privateRegistryImagePageAtom);
  // 검색어
  const searchText = useAtomValue(privateRegistryImageSearchTextAtom);

  const { data } = useGetPrivateRegistryImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryImageColumn([
          { dataIndex: "checkbox" },
          { dataIndex: "imageName" },
          { dataIndex: "tagCnt" },
          { dataIndex: "pullCount" },
          { dataIndex: "creator" },
          { dataIndex: "creatorDate" },
          { dataIndex: "description" },
        ])}
        data={data?.content || []}
        columnHeight={40}
      />
    </ListWrapper>
  );
}
