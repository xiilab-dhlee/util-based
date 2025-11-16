"use client";

import { useAtomValue } from "jotai";

import {
  privateRegistryImageTagPageAtom,
  privateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import { createPrivateRegistryImageTagColumn } from "@/components/common/columns/create-private-registry-image-tag-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-private-registry-image-tags";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 태그 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 */
export function PrivateRegistryImageTagListBody() {
  const page = useAtomValue(privateRegistryImageTagPageAtom);
  const searchText = useAtomValue(privateRegistryImageTagSearchTextAtom);

  const { data } = useGetPrivateRegistryImageTags({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    imageId: 1,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryImageTagColumn([
          { dataIndex: "checkbox" },
          { dataIndex: "tag" },
          { dataIndex: "imageSize" },
          { dataIndex: "scanStatus" },
          { dataIndex: "critical" },
          { dataIndex: "high" },
          { dataIndex: "medium" },
          { dataIndex: "low" },
          { dataIndex: "creator" },
          { dataIndex: "creatorDate" },
          { dataIndex: "lastCheckedAt" },
          { dataIndex: "available" },
          { dataIndex: "detail" },
        ])}
        activePadding
        data={data?.content || []}
      />
    </ListWrapper>
  );
}
