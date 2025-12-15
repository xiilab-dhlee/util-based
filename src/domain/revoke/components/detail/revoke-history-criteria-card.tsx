"use client";

import styled from "styled-components";

import { WorkloadTypeCriteriaCard } from "@/domain/revoke/components/workload-type-criteria-card";
import { useGetRevokeCriteria } from "@/domain/revoke/hooks/use-get-revoke-criteria";

/**
 * 리소스 회수 기준 카드 컴포넌트 (상세 페이지용)
 *
 * Interactive Job과 Batch Job의 회수 기준을 세로로 표시합니다.
 * - 사용 유무 스위치 없음 (읽기 전용)
 */
export function RevokeHistoryCriteriaCard() {
  const { data: criteriaList } = useGetRevokeCriteria();

  // Interactive와 Batch 기준 분리
  const interactiveCriteria = criteriaList?.find(
    (criteria) => criteria.jobType === "INTERACTIVE",
  );
  const batchCriteria = criteriaList?.find(
    (criteria) => criteria.jobType === "BATCH",
  );

  return (
    <Container>
      <Title>리소스 회수 기준</Title>
      <CardsWrapper>
        {batchCriteria && <WorkloadTypeCriteriaCard criteria={batchCriteria} />}
        {interactiveCriteria && (
          <WorkloadTypeCriteriaCard criteria={interactiveCriteria} />
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
