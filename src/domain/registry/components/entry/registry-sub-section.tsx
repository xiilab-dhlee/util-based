"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { useGetPrivateImageUsageByAccount } from "@/api/generated/admin-private-registry/admin-private-registry";
import { UserPrivateRegistryBody } from "@/domain/registry/components/entry/user-private-registry-body";
import { UserPrivateRegistryFilter } from "@/domain/registry/components/entry/user-private-registry-filter";
import { UserPrivateRegistryFooter } from "@/domain/registry/components/entry/user-private-registry-footer";
import { USER_REGISTRY_PAGE_SIZE } from "@/domain/registry/constants/registry.constant";
import { REGISTRY_USER_SORT_FIELD_MAP } from "@/domain/registry/constants/registry-user-list.constant";
import {
  userPrivateRegistryPageAtom,
  userPrivateRegistrySearchTextAtom,
  userPrivateRegistrySortAtom,
} from "@/domain/registry/state/registry.atom";
import { buildSortRequest } from "@/shared/utils/sort.util";

export function RegistrySubSection() {
  const searchText = useAtomValue(userPrivateRegistrySearchTextAtom);
  const page = useAtomValue(userPrivateRegistryPageAtom);
  const sort = useAtomValue(userPrivateRegistrySortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: REGISTRY_USER_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetPrivateImageUsageByAccount({
    pageNo: page - 1,
    pageSize: USER_REGISTRY_PAGE_SIZE,
    keyword: searchText,
    ...(sortRequest
      ? { sort: sortRequest.sort, order: sortRequest.order }
      : {}),
  });

  return (
    <Container>
      <Pane>
        <UserPrivateRegistryFilter
          totalSize={data?.totalSize}
          loading={isLoading}
        />
        <UserPrivateRegistryBody
          data={data?.content || []}
          isLoading={isLoading}
          isError={isError}
        />
        <UserPrivateRegistryFooter
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
        />
      </Pane>
    </Container>
  );
}

const Container = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 520px;
`;

const Pane = styled.article`
  height: 100%;
  padding: 24px 26px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;
