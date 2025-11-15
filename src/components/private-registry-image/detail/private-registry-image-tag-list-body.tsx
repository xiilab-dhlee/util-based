"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  privateRegistryImageTagPageAtom,
  privateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image/private-registry-image.atom";
import { createPrivateRegistryImageTagColumn } from "@/components/common/columns/create-private-registry-image-tag-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import privateRegistryImageDetailConstants from "@/constants/registry/private-registry-image-detail.constant";
import { useGetPrivateRegistryImageTags } from "@/hooks/registry/use-get-private-registry-image-tags";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 태그 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 */
export function PrivateRegistryImageTagListBody() {
  const [page, setPage] = useAtom(privateRegistryImageTagPageAtom);
  const searchText = useAtomValue(privateRegistryImageTagSearchTextAtom);

  const { data } = useGetPrivateRegistryImageTags({
    page,
    size: privateRegistryImageDetailConstants.tagPageSize,
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
          { dataIndex: "lastCheckedAt" },
          { dataIndex: "securityResult" },
          { dataIndex: "critical" },
          { dataIndex: "high" },
          { dataIndex: "medium" },
          { dataIndex: "low" },
          { dataIndex: "status" },
          { dataIndex: "scanStatus" },
          { dataIndex: "requestReason" },
          { dataIndex: "rejectReason" },
        ])}
        activePadding
        data={data?.content || []}
        pagination={{
          onChange: (nextPage: number) => {
            setPage(nextPage);
          },
          pageSize: privateRegistryImageDetailConstants.tagPageSize,
          total: data?.total,
        }}
      />
    </ListWrapper>
  );
}

