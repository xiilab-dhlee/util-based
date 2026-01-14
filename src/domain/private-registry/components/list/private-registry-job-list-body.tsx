"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ImageJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryImageCard } from "@/domain/private-registry/components/list/private-registry-image-card";
import { PRIVATE_REGISTRY_JOB_PAGE_SIZE } from "@/domain/private-registry/constants/private-registry.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface PrivateRegistryJobListBodyProps {
  data: ImageJobResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function PrivateRegistryJobListBody({
  data,
  isLoading,
  isError,
}: PrivateRegistryJobListBodyProps) {
  if (isLoading) {
    return (
      <Container>
        {Array.from({ length: PRIVATE_REGISTRY_JOB_PAGE_SIZE }).map(
          (_, index) => (
            <Card key={`skeleton-${index}`} loading style={{ flex: 1 }} />
          ),
        )}
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <EmptyState />
      </Container>
    );
  }

  if (data.length === 0) {
    return (
      <Container>
        <EmptyState />
      </Container>
    );
  }

  return (
    <Container className={SELECTOR.LIST_CARD_GRID}>
      {data.map((job) => (
        <PrivateRegistryImageCard key={job.imageId} {...job} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
