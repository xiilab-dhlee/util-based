"use client";

import styled from "styled-components";

import type { PullPushJobResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { MySpinner } from "@/shared/components/spinner";
import { PrivateRegistryImageCard } from "./private-registry-image-card";

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
        <MySpinner />
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
    <Container>
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
  max-height: 690px;
`;
