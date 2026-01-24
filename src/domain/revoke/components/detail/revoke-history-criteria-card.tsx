"use client";

import styled from "styled-components";

import { useGetAllPolicies } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";

export function RevokeHistoryCriteriaCard() {
  const { data: policyList } = useGetAllPolicies();

  // Interactive와 Batch 기준 분리
  const interactivePolicy = policyList?.find(
    (policy) => policy.workloadJobType === "INTERACTIVE",
  );
  const batchPolicy = policyList?.find(
    (policy) => policy.workloadJobType === "BATCH",
  );

  return (
    <Container>
      <Title>리소스 회수 기준</Title>
      <CardsWrapper>
        {batchPolicy && <WorkloadTypeCriteriaCard criteria={batchPolicy} />}
        {interactivePolicy && (
          <WorkloadTypeCriteriaCard criteria={interactivePolicy} />
        )}
      </CardsWrapper>
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9ebee;
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
  margin: 0;
`;

const CardsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;
