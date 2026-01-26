"use client";

// biome-ignore lint/suspicious/noShadowRestrictedNames: es-toolkit isFinite 사용
import { isFinite } from "es-toolkit/compat";
import { useParams } from "next/navigation";
import styled from "styled-components";

import { useGetScanHistoryPolicy } from "@/api/generated/workload-reclaim-policy-admin/workload-reclaim-policy-admin";
import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";

export function RevokeHistoryCriteriaCard() {
  const { id } = useParams<{ id: string }>();
  const scanHistoryId = Number(id);

  const { data: policy } = useGetScanHistoryPolicy(scanHistoryId, {
    query: {
      enabled: Boolean(id) && isFinite(scanHistoryId),
    },
  });

  return (
    <Container>
      <Title>리소스 회수 기준</Title>
      <CardsWrapper>
        {policy && <WorkloadTypeCriteriaCard criteria={policy} />}
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
