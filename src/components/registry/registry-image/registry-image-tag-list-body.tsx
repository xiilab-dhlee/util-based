"use client";

import { useAtom, useAtomValue } from "jotai";

import {
  privateRegistryImageTagSearchTextAtom,
  privateRegistryImageTagVulnerabilityPageAtom,
} from "@/atoms/registry/private-registry-image-detail.atom";
import { registryImageTagListColumn } from "@/components/common/columns/registry-image-tag-list-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import privateRegistryImageDetailConstants from "@/constants/registry/private-registry-image-detail.constant";
import { useGetPrivateRegistryImageTags } from "@/hooks/registry/use-get-private-registry-image-tags";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

export function RegistryImageTagListBody() {
  const [page, setPage] = useAtom(privateRegistryImageTagVulnerabilityPageAtom);
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
        columns={registryImageTagListColumn}
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

