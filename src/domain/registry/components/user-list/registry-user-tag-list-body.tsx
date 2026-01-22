"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { AccountImageTagResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { RegistryTagCard } from "@/domain/registry/components/user-list/registry-tag-card";
import {
  REGISTRY_USER_CARD_HEIGHT,
  REGISTRY_USER_TAG_PAGE_SIZE,
} from "@/domain/registry/constants/registry-user-list.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { TABLE_MESSAGE } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";

interface RegistryUserTagListBodyProps {
  data: AccountImageTagResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function RegistryUserTagListBody({
  data,
  isLoading,
  isError,
}: RegistryUserTagListBodyProps) {
  if (isLoading) {
    return (
      <Container>
        {Array.from({ length: REGISTRY_USER_TAG_PAGE_SIZE }).map((_, index) => (
          <Card
            key={`skeleton-${index}`}
            loading
            height={REGISTRY_USER_CARD_HEIGHT}
          />
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
      {data.map((tag) => (
        <RegistryTagCard key={tag.harborTagId} {...tag} />
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
