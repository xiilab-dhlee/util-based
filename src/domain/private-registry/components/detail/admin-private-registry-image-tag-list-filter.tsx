"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { Input } from "xiilab-ui";

import { ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/domain/private-registry-image/constants/private-registry-image.constant";
import { useGetAdminPrivateRegistryImageTags } from "@/domain/private-registry-image/hooks/use-get-admin-private-registry-image-tags";
import {
  adminPrivateRegistryImageTagPageAtom,
  adminPrivateRegistryImageTagSearchTextAtom,
} from "@/domain/private-registry-image/state/private-registry-image.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";

export function AdminPrivateRegistryImageTagListFilter() {
  const { id, name } = useParams();
  const setSearchText = useSetAtom(adminPrivateRegistryImageTagSearchTextAtom);

  const page = useAtomValue(adminPrivateRegistryImageTagPageAtom);
  const searchText = useAtomValue(adminPrivateRegistryImageTagSearchTextAtom);
  const { data } = useGetAdminPrivateRegistryImageTags({
    page,
    size: ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  const handleSearch = (value: string) => {
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="태그 목록" total={data?.totalSize}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
      />
    </MySearchFilter>
  );
}
