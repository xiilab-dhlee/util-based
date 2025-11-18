"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import {
  adminPrivateRegistryImageTagSearchTextAtom,
  adminPrivateRegistryImageTagVulnerabilityPageAtom,
} from "@/atoms/private-registry-image.atom";
import { createPrivateRegistryImageTagColumn } from "@/components/common/column/create-private-registry-image-tag-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/constants/private-registry-image/private-registry-image.constant";
import { useGetAdminPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-admin-private-registry-image-tags";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function AdminPrivateRegistryImageTagListBody() {
  const { id, name } = useParams();
  const [page, setPage] = useAtom(
    adminPrivateRegistryImageTagVulnerabilityPageAtom,
  );
  const searchText = useAtomValue(adminPrivateRegistryImageTagSearchTextAtom);

  const { data } = useGetAdminPrivateRegistryImageTags({
    page,
    size: ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryImageTagColumn([
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
          pageSize: ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE,
          total: data?.totalSize,
        }}
      />
    </ListWrapper>
  );
}
