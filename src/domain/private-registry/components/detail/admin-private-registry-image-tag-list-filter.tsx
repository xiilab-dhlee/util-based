"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { ADMIN_PRIVATE_REGISTRY_IMAGE_TAG_PAGE_SIZE } from "@/domain/private-registry-image/constants/private-registry-image.constant";
import { useGetAdminPrivateRegistryImageTags } from "@/domain/private-registry-image/hooks/use-get-admin-private-registry-image-tags";
import {
  adminPrivateRegistryImageTagPageAtom,
  adminPrivateRegistryImageTagSearchTextAtom,
} from "@/domain/private-registry-image/state/private-registry-image.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

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
