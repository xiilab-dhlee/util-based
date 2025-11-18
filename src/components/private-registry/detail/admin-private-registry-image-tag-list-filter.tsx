"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import {
  adminPrivateRegistryImageTagPageAtom,
  adminPrivateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image.atom";
import { SearchInput } from "@/components/common/input/search-input";
import { ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/constants/private-registry-image/private-registry-image.constant";
import { useSearch } from "@/hooks/common/use-search";
import { useGetAdminPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-admin-private-registry-image-tags";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function AdminPrivateRegistryImageTagListFilter() {
  const { id, name } = useParams();
  const { onSubmit } = useSearch(adminPrivateRegistryImageTagSearchTextAtom);

  const page = useAtomValue(adminPrivateRegistryImageTagPageAtom);
  const searchText = useAtomValue(adminPrivateRegistryImageTagSearchTextAtom);
  const { data } = useGetAdminPrivateRegistryImageTags({
    page,
    size: ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  return (
    <MySearchFilter title="태그 목록" total={data?.totalSize || 0}>
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
