"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { Input } from "xiilab-ui";

import { ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/domain/internal-registry-image/constants/internal-registry-image.constant";
import { useGetAdminInternalRegistryImageTags } from "@/domain/internal-registry-image/hooks/use-get-admin-internal-registry-image-tags";
import {
  adminInternalRegistryImageTagPageAtom,
  adminInternalRegistryImageTagSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function AdminInternalRegistryImageTagListFilter() {
  const { id, name } = useParams();
  const setSearchText = useSetAtom(adminInternalRegistryImageTagSearchTextAtom);

  const page = useAtomValue(adminInternalRegistryImageTagPageAtom);
  const searchText = useAtomValue(adminInternalRegistryImageTagSearchTextAtom);
  const { data } = useGetAdminInternalRegistryImageTags({
    page,
    size: ADMIN_INTERNAL_REGISTRY_IMAGE_TAG_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  return (
    <MySearchFilter title="태그 목록" total={data?.totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={(value) => setSearchText(value.trim())}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
