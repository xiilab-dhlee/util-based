"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";
import { useGetPrivateRegistryVulnerabilities } from "../../hooks/use-get-private-registry-vulnerabilities";
import { privateRegistryTagSelectedAtom } from "../../state/private-registry-tag.atom";
import { privateRegistryVulnerabilityPageAtom } from "../../state/private-registry-vulnerability.atom";
import { PrivateRegistryVulnerabilityBody } from "./private-registry-vulnerability-body";
import { PrivateRegistryVulnerabilityFilter } from "./private-registry-vulnerability-filter";
import { PrivateRegistryVulnerabilityFooter } from "./private-registry-vulnerability-footer";

export function PrivateRegistryDetailAside() {
  const page = useAtomValue(privateRegistryVulnerabilityPageAtom);
  const selectedTag = useAtomValue(privateRegistryTagSelectedAtom);

  const { data, isLoading, isError } = useGetPrivateRegistryVulnerabilities({
    pageNo: page - 1,
    pageSize: 18,
    imageTagId: selectedTag?.harborArtifactId ?? null,
  });

  console.log(selectedTag);

  console.log(data);

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
