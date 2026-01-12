"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { useGetPullPushJobs1 } from "@/api/generated/private-registry/private-registry";
import {
  pullPushJobPageAtom,
  pullPushJobSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { PrivateRegistryJobListBody } from "./private-registry-job-list-body";
import { PrivateRegistryJobListFilter } from "./private-registry-job-list-filter";
import { PrivateRegistryJobListFooter } from "./private-registry-job-list-footer";

export function PrivateRegistryListAside() {
  const page = useAtomValue(pullPushJobPageAtom);
  const searchText = useAtomValue(pullPushJobSearchTextAtom);

  const { data, isLoading, isError } = useGetPullPushJobs1({
    keyword: searchText,
    pageNo: page - 1,
    pageSize: 5,
  });

  return (
    <StyledAsideDetailContainer>
      <PrivateRegistryJobListFilter
        totalSize={data?.totalSize}
        loading={isLoading}
      />
      <PrivateRegistryJobListBody
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
      />
      <PrivateRegistryJobListFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 16px 24px;
`;
