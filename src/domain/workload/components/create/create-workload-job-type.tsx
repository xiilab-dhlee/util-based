"use client";

import { useAtom } from "jotai";
import type { Dispatch, SetStateAction } from "react";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { JobTypeCard } from "@/domain/workload/components/create/job-type-card";
import { WORKLOAD_JOB_TYPES } from "@/domain/workload/constants/workload.constant";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import { jobTypeAtom } from "@/domain/workload/state/create-workload.atom";
import type { WorkloadJobType } from "@/domain/workload/types/workload.type";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

const JOB_TYPES: WorkloadJobType[] = [
  WORKLOAD_JOB_TYPES.BATCH,
  WORKLOAD_JOB_TYPES.INTERACTIVE,
];

export function CreateWorkloadJobType() {
  const [jobType, setJobType] = useAtom(jobTypeAtom);
  const { control } = useFormContext<CreateWorkloadFormValues>();
  const { field: jobTypeField } = useController({
    name: "workloadJobType",
    control,
  });

  const handleSelectJobType: Dispatch<SetStateAction<WorkloadJobType>> = (
    nextType,
  ) => {
    const resolvedType =
      typeof nextType === "function" ? nextType(jobType) : nextType;
    jobTypeField.onChange(resolvedType);
    setJobType(resolvedType);
  };

  const jobTypeCards = JOB_TYPES.map((type) => (
    <JobTypeCard
      key={type}
      type={type}
      value={jobTypeField.value ?? jobType}
      setValue={handleSelectJobType}
    />
  ));

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          Job Type
        </CreateWorkloadSectionTitle>
      </Header>
      <Body>{jobTypeCards}</Body>
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
