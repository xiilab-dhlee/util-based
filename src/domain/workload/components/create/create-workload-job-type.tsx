"use client";

import { useAtom } from "jotai";
import styled from "styled-components";

import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import type { WorkloadJobType } from "../../schemas/workload.schema";
import { jobTypeAtom } from "../../state/create-workload.atom";
import { JobTypeCard } from "./job-type-card";

const JOB_TYPES: WorkloadJobType[] = ["BATCH", "INTERACTIVE"];

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
  margin-bottom: 6px;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;
