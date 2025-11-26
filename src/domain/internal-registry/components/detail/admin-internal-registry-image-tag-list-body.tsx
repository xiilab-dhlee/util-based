"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/domain/internal-registry-image/constants/internal-registry-image.constant";
import { useGetAdminInternalRegistryImageTags } from "@/domain/internal-registry-image/hooks/use-get-admin-internal-registry-image-tags";
import {
  adminInternalRegistryImageTagSearchTextAtom,
  adminInternalRegistryImageTagVulnerabilityPageAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { createInternalRegistryImageTagColumn } from "@/shared/components/column/create-internal-registry-image-tag-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function AdminInternalRegistryImageTagListBody() {
  const { id, name } = useParams();
  const [page, setPage] = useAtom(
    adminInternalRegistryImageTagVulnerabilityPageAtom,
  );
  const searchText = useAtomValue(adminInternalRegistryImageTagSearchTextAtom);

  const { data } = useGetAdminInternalRegistryImageTags({
    page,
    size: ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createInternalRegistryImageTagColumn([
          // { dataIndex: "admin-checkbox" },
          { dataIndex: "tag" },
          { dataIndex: "imageSize" },
          { dataIndex: "scanStatus" },
          { dataIndex: "securityResult" },
          { dataIndex: "creatorName" },
          { dataIndex: "creatorDate" },
          { dataIndex: "lastCheckedAt" },
          { dataIndex: "available" },
          { dataIndex: "rejectReason" },
          { dataIndex: "requestReason" },
        ])}
        activePadding
        data={data?.content || []}
        pagination={{
          onChange: (nextPage: number) => {
            setPage(nextPage);
          },
          pageSize: ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE,
          total: data?.totalSize,
        }}
      />
    </ListWrapper>
  );
}
