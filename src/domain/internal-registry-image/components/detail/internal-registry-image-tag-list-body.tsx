"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { useGetInternalRegistryImageTags } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-image-tags";
import {
  internalregistryImageTagPageAtom,
  internalregistryImageTagSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { createInternalRegistryImageTagColumn } from "@/shared/components/column/create-internal-registry-image-tag-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 *
 * 내부 레지스트리 이미지 태그 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 내부 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 */
export function InternalRegistryImageTagListBody() {
  const { id } = useParams();

  const page = useAtomValue(internalregistryImageTagPageAtom);
  const searchText = useAtomValue(internalregistryImageTagSearchTextAtom);

  const { data } = useGetInternalRegistryImageTags({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    imageId: Number(id),
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createInternalRegistryImageTagColumn([
          { key: "checkbox" },
          { key: "tag" },
          { key: "imageSize" },
          { key: "uploadStatus" },
          { key: "scanStatus" },
          { key: "securityResult" },
          { key: "creatorName" },
          { key: "creatorDate" },
          { key: "lastCheckedAt" },
          { key: "status" },
          { key: "available" },
          { key: "requestReason" },
          { key: "rejectReason" },
        ])}
        activePadding
        data={data?.content || []}
        columnHeight={38}
      />
    </ListWrapper>
  );
}
