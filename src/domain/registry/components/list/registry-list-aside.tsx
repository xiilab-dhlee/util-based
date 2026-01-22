"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import type { ImageJobFilterRequestImageType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetImageJobs } from "@/api/generated/image-job/image-job";
import { RegistryJobListBody } from "@/domain/registry/components/list/registry-job-list-body";
import { RegistryJobListFilter } from "@/domain/registry/components/list/registry-job-list-filter";
import { RegistryJobListFooter } from "@/domain/registry/components/list/registry-job-list-footer";
import { REGISTRY_JOB_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import {
  imageJobImageSourceTypeAtom,
  imageJobPageAtom,
  imageJobSearchTextAtom,
} from "@/domain/registry/state/registry-list.atom";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

interface RegistryListAsideProps {
  imageType: ImageJobFilterRequestImageType;
}

export function RegistryListAside({ imageType }: RegistryListAsideProps) {
  const page = useAtomValue(imageJobPageAtom);
  const searchText = useAtomValue(imageJobSearchTextAtom);
  const imageSourceType = useAtomValue(imageJobImageSourceTypeAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const { data, isLoading, isError } = useGetImageJobs(
    {
      pageRequest: {
        pageNo: page - 1,
        pageSize: REGISTRY_JOB_PAGE_SIZE,
        keyword: searchText,
      },
      filterRequest: {
        imageType,
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
      <RegistryJobListFilter
        totalSize={data?.totalSize || 0}
        loading={isLoading}
      />
      <RegistryJobListBody
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
      />
      <RegistryJobListFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 16px 24px 20px 24px;
`;
