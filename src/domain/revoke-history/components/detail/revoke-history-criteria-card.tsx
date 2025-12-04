"use client";

import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { useGetRevokeCriteria } from "@/domain/revoke-history/hooks/use-get-revoke-criteria";
import type { RevokeCriteriaItemType } from "@/domain/revoke-history/schemas/revoke-history.schema";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { AsideFillCard } from "@/shared/components/layouts/aside-fill-card";
import { getJobTypeLabel } from "@/shared/constants/workload.constant";
import { getResourceInfo } from "@/shared/utils/resource.util";

const GPU_INFO = getResourceInfo("GPU");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

/**
 * 리소스 회수 기준 카드 컴포넌트
 *
 * API를 통해 회수 기준 데이터를 조회하여 표시합니다.
 */
export function RevokeHistoryCriteriaCard() {
  const { data: criteriaList, isLoading, isError } = useGetRevokeCriteria();

  if (isLoading) {
    return (
      <AsideFillCard title="리소스 회수 기준">
        <LoadingText>로딩 중...</LoadingText>
      </AsideFillCard>
    );
  }

  if (isError || !criteriaList) {
    return (
      <AsideFillCard title="리소스 회수 기준">
        <ErrorText>데이터를 불러오는데 실패했습니다.</ErrorText>
      </AsideFillCard>
    );
  }

  return (
    <AsideFillCard title="리소스 회수 기준">
      <CriteriaList>
        {criteriaList.map((criteria) => (
          <CriteriaItem key={criteria.jobType} criteria={criteria} />
        ))}
      </CriteriaList>
    </AsideFillCard>
  );
}

interface CriteriaItemProps {
  criteria: RevokeCriteriaItemType;
}

/**
 * 회수 기준 항목 컴포넌트 (2열 그리드)
 */
function CriteriaItem({ criteria }: CriteriaItemProps) {
  return (
    <ItemContainer>
      <ItemHeader>{`${getJobTypeLabel(criteria.jobType)} Job`}</ItemHeader>
      <ItemBody>
        <GridContainer>
          {/* 왼쪽 열: GPU, Memory, CPU */}
          <GridColumn>
            <CriteriaCell
              icon={
                GPU_INFO.icon ? (
                  <Icon
                    name={GPU_INFO.icon}
                    color="var(--icon-fill)"
                    size={22}
                  />
                ) : null
              }
              color={GPU_INFO.color}
              label="GPU"
              value={`${criteria.gpuThreshold}% 미만`}
            />
            <CriteriaCell
              icon={
                MEM_INFO.icon ? (
                  <Icon
                    name={MEM_INFO.icon}
                    color="var(--icon-fill)"
                    size={22}
                  />
                ) : null
              }
              color={MEM_INFO.color}
              label="Memory"
              value={`${criteria.memoryThreshold}% 미만`}
            />
            <CriteriaCell
              icon={
                CPU_INFO.icon ? (
                  <Icon
                    name={CPU_INFO.icon}
                    color="var(--icon-fill)"
                    size={22}
                  />
                ) : null
              }
              color={CPU_INFO.color}
              label="CPU"
              value={`${criteria.cpuThreshold}% 미만`}
            />
          </GridColumn>
          {/* 오른쪽 열: 회수 기준, 운영시간, 경고 횟수 */}
          <GridColumn>
            <CriteriaCell
              icon={<RefreshIcon width={20} height={20} fill="#6B7280" />}
              color="#6B7280"
              label="회수 기준"
              value={criteria.revokeCriteria}
            />
            <CriteriaCell
              icon={<Icon name="Time" size={20} color="#6B7280" />}
              color="#6B7280"
              label="운영시간"
              value={`${criteria.operationHours}시간 동안`}
            />
            <CriteriaCell
              icon={<Icon name="Error" size={20} color="#F87171" />}
              color="#F87171"
              label="경고 횟수"
              value={`${criteria.warningCount}회`}
            />
          </GridColumn>
        </GridContainer>
      </ItemBody>
    </ItemContainer>
  );
}

interface CriteriaCellProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string;
}

/**
 * 개별 기준 셀 컴포넌트
 */
function CriteriaCell({ icon, color, label, value }: CriteriaCellProps) {
  return (
    <CellContainer>
      <IconWrapper $fillColor={color}>{icon}</IconWrapper>
      <TextContainer>
        <CellLabel>{label}</CellLabel>
        <CellValue>{value}</CellValue>
      </TextContainer>
    </CellContainer>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const CriteriaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
`;

const ItemHeader = styled.div`
  padding: 16px 20px;
  font-weight: 600;
  font-size: 16px;
  color: #111827;
`;

const ItemBody = styled.div`
  padding: 0 20px 20px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CellContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const IconWrapper = styled.div<{ $fillColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ $fillColor }) => `${$fillColor}33`};
  border-radius: 6px;
  background: ${({ $fillColor }) => `${$fillColor}0D`};

  --icon-fill: ${({ $fillColor }) => $fillColor};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CellLabel = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

const CellValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

const LoadingText = styled.div`
  font-size: 12px;
  color: #666666;
  text-align: center;
  padding: 20px;
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #d32f2f;
  text-align: center;
  padding: 20px;
`;
