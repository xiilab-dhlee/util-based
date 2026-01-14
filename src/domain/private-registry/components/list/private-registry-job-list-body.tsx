"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { PullPushJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { PrivateRegistryImageCard } from "@/domain/private-registry/components/list/private-registry-image-card";
import {
  PRIVATE_REGISTRY_JOB_CARD_HEIGHT,
  PRIVATE_REGISTRY_JOB_PAGE_SIZE,
} from "@/domain/private-registry/constants/private-registry.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface PrivateRegistryJobListBodyProps {
  data: PullPushJobResponse[];
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
            <Card
              key={`skeleton-${index}`}
              loading
              style={{ height: PRIVATE_REGISTRY_JOB_CARD_HEIGHT }}
            />
          ),
        )}
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <DataErrorState />
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
  gap: 12px;
`;
