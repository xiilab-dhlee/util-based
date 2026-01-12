"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import {
  privateregistryImageTagPageAtom,
  privateregistryImageTagSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { createPrivateRegistryTagColumn } from "@/shared/components/column/create-private-registry-tag-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 프라이빗 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 *
 * 프라이빗 레지스트리 이미지 태그 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 프라이빗 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 */
export function PrivateRegistryTagListBody() {
  const { id } = useParams();

  const page = useAtomValue(privateregistryImageTagPageAtom);
  const searchText = useAtomValue(privateregistryImageTagSearchTextAtom);

  const { data } = useGetPrivateImageTagList({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText,
    harborImageName: decodeURIComponent(id as string),
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryTagColumn([
          { dataIndex: "checkbox" },
          { dataIndex: "imageTagName" },
          { dataIndex: "imageTagSizeByte" },
          { dataIndex: "uploadStatus" },
          { dataIndex: "scanStatus" },
          { dataIndex: "vulnerability" },
          { dataIndex: "creatorName" },
          { dataIndex: "createdAt" },
        ])}
        activePadding
        data={data?.content || []}
        columnHeight={38}
      />
    </ListWrapper>
  );
}
