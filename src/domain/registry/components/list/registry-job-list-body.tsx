"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ImageJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RegistryImageCard } from "@/domain/registry/components/list/registry-image-card";
import { REGISTRY_JOB_PAGE_SIZE } from "@/domain/registry/constants/registry-list.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryJobListBodyProps {
  data: ImageJobResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function RegistryJobListBody({
  data,
  isLoading,
  isError,
}: RegistryJobListBodyProps) {
  if (isLoading) {
    return (
      <Container>
        {Array.from({ length: REGISTRY_JOB_PAGE_SIZE }).map((_, index) => (
          <Card key={`skeleton-${index}`} loading />
        ))}
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <EmptyState title={TABLE_MESSAGE.ERROR} />
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
    <Container data-testid={SELECTOR.LIST_CARD_GRID}>
      {data.map((job) => (
        <RegistryImageCard key={job.imageTagId} {...job} />
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
