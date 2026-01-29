"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import type { ActiveWorkloadResponseWorkloadJobType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { JobTypeCard } from "@/domain/workload/components/create/job-type-card";
import { jobTypeAtom } from "@/domain/workload/state/create-workload.atom";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

const JOB_TYPES: ActiveWorkloadResponseWorkloadJobType[] = [
  "BATCH",
  "INTERACTIVE",
];

export function CreateWorkloadJobType() {
  const [jobType, setJobType] = useAtom(jobTypeAtom);

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          Job Type
        </CreateWorkloadSectionTitle>
      </Header>
      <Body>
        {JOB_TYPES.map((type) => (
          <JobTypeCard
            key={type}
            type={type}
            value={jobType}
            setValue={setJobType}
          />
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid var(--color-gray-10);
  background: var(--color-gray-17);
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 8px;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;
