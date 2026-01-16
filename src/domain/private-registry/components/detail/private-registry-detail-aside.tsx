"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { PrivateRegistryVulnerabilityBody } from "@/domain/private-registry/components/detail/private-registry-vulnerability-body";
import { PrivateRegistryVulnerabilityFilter } from "@/domain/private-registry/components/detail/private-registry-vulnerability-filter";
import { PrivateRegistryVulnerabilityFooter } from "@/domain/private-registry/components/detail/private-registry-vulnerability-footer";
import { PRIVATE_REGISTRY_VULNERABILITY_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry-vulnerability.constant";
import { useGetPrivateRegistryVulnerabilities } from "@/domain/private-registry/hooks/use-get-private-registry-vulnerabilities";
import { privateRegistryTagSelectedAtom } from "@/domain/private-registry/state/private-registry-tag.atom";
import { privateRegistryVulnerabilityPageAtom } from "@/domain/private-registry/state/private-registry-vulnerability.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

export function PrivateRegistryDetailAside() {
  const page = useAtomValue(privateRegistryVulnerabilityPageAtom);
  const selectedTag = useAtomValue(privateRegistryTagSelectedAtom);

  const { data, isLoading, isError } = useGetPrivateRegistryVulnerabilities({
    pageNo: page - 1,
    pageSize: PRIVATE_REGISTRY_VULNERABILITY_PAGE_SIZE,
    imageTagId: selectedTag?.harborArtifactId ?? null,
  });

  if (selectedTag === null) {
    return (
      <StyledAsideDetailContainer>
        <EmptyState title="태그를 선택해 주세요." />
      </StyledAsideDetailContainer>
    );
  }

  return (
    <StyledAsideDetailContainer>
      <PrivateRegistryVulnerabilityFilter totalSize={data?.totalSize || 0} />
      <PrivateRegistryVulnerabilityBody
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
      />
      <PrivateRegistryVulnerabilityFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 18px 24px 20px 24px;
`;
