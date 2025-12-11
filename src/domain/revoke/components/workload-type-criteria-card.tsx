"use client";

import type { ReactNode } from "react";
import styled from "styled-components";
import { Icon, Switch, Typography } from "xiilab-ui";

import type { RevokeCriteriaItemType } from "@/domain/revoke/schemas/revoke-history.schema";
import { getJobTypeLabel } from "@/domain/workload/constants/workload.constant";
import { RefreshIcon } from "@/shared/components/icon/refresh-icon";
import { getResourceInfo } from "@/shared/utils/resource.util";

const GPU_INFO = getResourceInfo("GPU");
const CPU_INFO = getResourceInfo("CPU");
const MEM_INFO = getResourceInfo("MEM");

/**
 * WorkloadTypeCriteriaCard props 타입
 * enabled와 onEnabledChange는 반드시 함께 제공되거나 함께 제공되지 않아야 합니다.
 */
type WorkloadTypeCriteriaCardProps =
  | {
      /** 회수 기준 데이터 */
      criteria: RevokeCriteriaItemType;
      /** 사용 유무 */
      enabled: boolean;
      /** 사용 유무 변경 핸들러 */
      onEnabledChange: (enabled: boolean) => void;
    }
  | {
      /** 회수 기준 데이터 */
      criteria: RevokeCriteriaItemType;
      /** 사용 유무 (제공하지 않음) */
      enabled?: never;
      /** 사용 유무 변경 핸들러 (제공하지 않음) */
      onEnabledChange?: never;
    };

/**
 * Workload Type별 회수 기준 카드 컴포넌트
 *
 * Interactive Job 또는 Batch Job의 리소스 회수 기준을 표시합니다.
 * - on/off 토글 스위치 (optional)
 * - GPU, Memory, CPU 임계값
 * - 회수 기준(OR/AND), 운영시간, 경고 횟수
 */
export function WorkloadTypeCriteriaCard({
  criteria,
  enabled,
  onEnabledChange,
}: WorkloadTypeCriteriaCardProps) {
  const showToggle = enabled !== undefined && onEnabledChange !== undefined;

  return (
    <CardContainer>
      {/* 헤더: 타이틀 + 사용 유무 토글 */}
      <CardHeader>
        <JobTitle>{`${getJobTypeLabel(criteria.jobType)} Job`}</JobTitle>
        {showToggle && (
          <ToggleWrapper>
            <Typography.Text variant="body-2-4" color="var(--color-gray-06)">
              사용 유무
            </Typography.Text>
            <Switch checked={enabled} onChange={onEnabledChange} />
          </ToggleWrapper>
        )}
      </CardHeader>

      {/* 바디: 2x3 그리드 레이아웃 */}
      <CardBody>
        <GridContainer>
          {/* 왼쪽 열 */}
          <GridColumn>
            <CriteriaCell
              icon={
                GPU_INFO.icon ? (
                  <Icon
                    name={GPU_INFO.icon}
                    color="var(--icon-fill)"
                    size={24}
                  />
                ) : null
              }
              color={GPU_INFO.color}
              label={GPU_INFO.text}
              value={`${criteria.gpuThreshold}%`}
              unit="미만"
            />
            <CriteriaCell
              icon={
                MEM_INFO.icon ? (
                  <Icon
                    name={MEM_INFO.icon}
                    color="var(--icon-fill)"
                    size={24}
                  />
                ) : null
              }
              color={MEM_INFO.color}
              label={MEM_INFO.text}
              value={`${criteria.memoryThreshold}%`}
              unit="미만"
            />
            <CriteriaCell
              icon={
                CPU_INFO.icon ? (
                  <Icon
                    name={CPU_INFO.icon}
                    color="var(--icon-fill)"
                    size={24}
                  />
                ) : null
              }
              color={CPU_INFO.color}
              label={CPU_INFO.text}
              value={`${criteria.cpuThreshold}%`}
              unit="미만"
            />
          </GridColumn>

          {/* 오른쪽 열 */}
          <GridColumn>
            <CriteriaCell
              icon={
                <RefreshIcon
                  width={24}
                  height={24}
                  fill="var(--color-gray-05)"
                />
              }
              color="var(--color-gray-10)"
              label="회수 기준"
              value={criteria.revokeCriteria}
            />
            <CriteriaCell
              icon={<Icon name="Time" size={24} color="var(--color-gray-05)" />}
              color="var(--color-gray-10)"
              label="운영시간"
              value={`${criteria.operationHours}시간`}
              unit="동안"
            />
            <CriteriaCell
              icon={<Icon name="Error" size={24} color="var(--color-red-05)" />}
              color="var(--color-red-03)"
              label="경고 횟수"
              value={`${criteria.warningCount}`}
              unit="회"
            />
          </GridColumn>
        </GridContainer>
      </CardBody>
    </CardContainer>
  );
}

interface CriteriaCellProps {
  icon: ReactNode;
  color: string;
  label: string;
  value: string;
  unit?: string;
}

/**
 * 개별 기준 셀 컴포넌트
 */
function CriteriaCell({ icon, color, label, value, unit }: CriteriaCellProps) {
  return (
    <CellWrapper>
      <CellContainer>
        <IconWrapper $borderColor={color}>{icon}</IconWrapper>
        <TextContainer>
          <Typography.Text variant="body-2-3">{label}</Typography.Text>
          <ValueWrapper>
            <Typography.Text variant="body-2-2">{value}</Typography.Text>
            {unit && (
              <Typography.Text variant="body-2-4">{unit}</Typography.Text>
            )}
          </ValueWrapper>
        </TextContainer>
      </CellContainer>
    </CellWrapper>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #f7f9fb;
  border: 1px solid var(--color-gray-10);
  border-radius: 4px;
  overflow: hidden;
`;

const CardHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 10px;
  gap: 8px;

  /* 헤더 하단 구분선 - 좌우 패딩 */
  &::after {
    content: "";
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 0;
    height: 1px;
    background-color: #e1e4e7;
  }
`;

const JobTitle = styled.h3`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin: 0;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CardBody = styled.div`
  padding: 10px 10px 10px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  row-gap: 10px;
`;

const GridColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CellWrapper = styled.div`
  position: relative;

  /* 왼쪽 열: 가로 구분선 (우측 세로선 제외) */
  ${GridColumn}:first-child &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 0;
    right: 10px; /* 세로선 영역 제외 */
    bottom: -5px; /* gap의 중앙 */
    height: 1px;
    background-color: var(--color-gray-10);
  }

  /* 오른쪽 열: 가로 구분선 (좌측 세로선 제외) */
  ${GridColumn}:last-child &:not(:last-child)::after {
    content: "";
    position: absolute;
    left: 10px; /* 세로선 영역 제외 */
    right: 0;
    bottom: -5px; /* gap의 중앙 */
    height: 1px;
    background-color: var(--color-gray-10);
  }

  /* 세로 구분선: 왼쪽 열의 각 셀 오른쪽에 - 상하 여백 */
  ${GridColumn}:first-child &::before {
    content: "";
    position: absolute;
    right: -5px; /* gap의 중앙 */
    top: 5px; /* 상단 여백 */
    bottom: 5px; /* 하단 여백 */
    width: 1px;
    background-color: var(--color-gray-10);
  }
`;

const CellContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
`;

const IconWrapper = styled.div<{ $borderColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: 1px solid ${({ $borderColor }) => $borderColor};
  border-radius: 2px;
  background: #ffffff;

  --icon-fill: ${({ $borderColor }) => $borderColor};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
`;
