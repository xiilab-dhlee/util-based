"use client";

import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import styled from "styled-components";

import { RegistryVulnerabilityBody } from "@/domain/registry/components/detail/registry-vulnerability-body";
import { RegistryVulnerabilityFilter } from "@/domain/registry/components/detail/registry-vulnerability-filter";
import { RegistryVulnerabilityFooter } from "@/domain/registry/components/detail/registry-vulnerability-footer";
import { REGISTRY_VULNERABILITY_PAGE_SIZE } from "@/domain/registry/constants/registry-detail.constant";
import { useGetRegistryTagVulnerabilitiesByMode } from "@/domain/registry/hooks/use-get-registry-tag-vulnerabilities-by-mode";
import {
  registryTagSelectedAtom,
  registryVulnerabilityPageAtom,
} from "@/domain/registry/state/registry-detail.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { AsideDetailContainer } from "@/styles/layers/aside-detail-layers.styled";

interface RegistryDetailAsideProps {
  mode: RegistryMode;
}

export function RegistryDetailAside({ mode }: RegistryDetailAsideProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";
  const page = useAtomValue(registryVulnerabilityPageAtom);
  const selectedTag = useAtomValue(registryTagSelectedAtom);

  const { data, isLoading, isError } = useGetRegistryTagVulnerabilitiesByMode(
    mode,
    {
      pageRequest: {
        pageNo: page - 1,
        pageSize: REGISTRY_VULNERABILITY_PAGE_SIZE,
      },
      request: {
        harborImageName,
        tagName: selectedTag?.imageTagName ?? "",
      },
    },
    {
      query: {
        enabled: !!harborImageName && !!selectedTag?.imageTagName,
      },
    },
  );

  if (selectedTag === null) {
    return (
      <StyledAsideDetailContainer>
        <EmptyState title="태그를 선택해 주세요." />
      </StyledAsideDetailContainer>
    );
  }

  return (
    <StyledAsideDetailContainer>
      <RegistryVulnerabilityFilter totalSize={data?.totalSize || 0} />
      <RegistryVulnerabilityBody
        data={data?.content ?? []}
        isLoading={isLoading}
        isError={isError}
      />
      <RegistryVulnerabilityFooter
        totalSize={data?.totalSize || 0}
        isLoading={isLoading}
      />
    </StyledAsideDetailContainer>
  );
}

const StyledAsideDetailContainer = styled(AsideDetailContainer)`
  padding: 18px 24px 20px 24px;
`;
