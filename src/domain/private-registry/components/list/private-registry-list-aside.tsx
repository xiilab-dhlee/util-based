"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { useGetImageJobs } from "@/api/generated/image-job/image-job";
import { PrivateRegistryJobListBody } from "@/domain/private-registry/components/list/private-registry-job-list-body";
import { PrivateRegistryJobListFilter } from "@/domain/private-registry/components/list/private-registry-job-list-filter";
import { PrivateRegistryJobListFooter } from "@/domain/private-registry/components/list/private-registry-job-list-footer";
import { PRIVATE_REGISTRY_JOB_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry.constant";
import {
  imageJobImageSourceTypeAtom,
  imageJobPageAtom,
  imageJobSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function PrivateRegistryListAside() {
  const page = useAtomValue(imageJobPageAtom);
  const searchText = useAtomValue(imageJobSearchTextAtom);
  const imageSourceType = useAtomValue(imageJobImageSourceTypeAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const { data, isLoading, isError } = useGetImageJobs(
    {
      pageRequest: {
        pageNo: page - 1,
        pageSize: PRIVATE_REGISTRY_JOB_PAGE_SIZE,
        keyword: searchText,
      },
      filterRequest: {
        imageType: "PRIVATE",
        isMine: false,
        imageSourceType,
      },
    },
    {
      query: {
        enabled: !!selectedWorkspace?.workspaceId,
      },
    },
  );

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
  padding: 16px 24px 20px 24px;
`;
