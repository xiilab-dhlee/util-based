import classNames from "classnames";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { UserMonitoringResourceClusterChart } from "@/domain/user-monitoring/components/user-monitoring-resource-cluster-chart";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { getPercent } from "@/shared/utils/calc.util";
import { getResourceInfo } from "@/shared/utils/resource.util";

/** 클러스터 리소스 데이터 타입 */
export interface ClusterResourceData {
  total?: number;
  requested?: number;
  used?: number;
}

/**
 * 값이 없으면 '-'를 반환하고, 있으면 숫자를 반환합니다.
 */
function formatValue(value?: number): string {
  return value !== undefined && value !== null ? String(value) : "-";
}

/**
 * 값이 존재하는지 확인합니다.
 */
function hasValue(value?: number): boolean {
  return value !== undefined && value !== null;
}

interface UserMonitoringResourceClusterProps {
  gradientToColors: string[];
  resourceType: CoreResourceType;
  data: ClusterResourceData;
}

export function MonitoringClusterResource({
  gradientToColors,
  resourceType,
  data,
}: UserMonitoringResourceClusterProps) {
  const { unit, text } = getResourceInfo(resourceType);

  const hasPercentData = hasValue(data.total);
  const percent = getPercent(data.used ?? 0, data.total ?? 0);

  return (
    <Container className={classNames({ "gpu-only": resourceType === "GPU" })}>
      <Left>
        <ChartWrapper>
          <UserMonitoringResourceClusterChart
            series={percent}
            gradientToColors={gradientToColors}
          />
        </ChartWrapper>

        <ChartLabel>
          <ChartLabelItem>
            <ChartTitle>{text}</ChartTitle>
          </ChartLabelItem>
          <ChartLabelItem>
            <ChartPercent>{hasPercentData ? `${percent}%` : "-"}</ChartPercent>
          </ChartLabelItem>
        </ChartLabel>
      </Left>
      <Right>
        <RightHeader>
          <Typography.Text variant="subtitle-1" color="#f5f5f5">
            전체
          </Typography.Text>
          <Value>
            <TotalCount>{formatValue(data.total)}</TotalCount>
            {hasValue(data.total) && <TotalUnit>{unit}</TotalUnit>}
          </Value>
        </RightHeader>
        <RightBody>
          <Record>
            <Key>요청</Key>
            <Value>
              <Count>{formatValue(data.requested)}</Count>
              {hasValue(data.requested) && <CountUnit>{unit}</CountUnit>}
            </Value>
          </Record>
          <Record>
            <Key>사용</Key>
            <Value>
              <Count>{formatValue(data.used)}</Count>
              {hasValue(data.used) && <CountUnit>{unit}</CountUnit>}
            </Value>
          </Record>
        </RightBody>
      </Right>
    </Container>
  );
}

/**
 * 클러스터 자원 정보 카드
 *
 * 클러스터 자원 정보를 표시하는 개별 카드입니다.
 * 292px 이상의 너비에서 배경색이 변경되고 CardRight가 숨겨집니다.
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &.gpu-only {
    border-right: 1px solid #292b32;
  }
`;

/**
 * 카드 왼쪽 영역
 *
 * 클러스터 차트를 표시하는 영역입니다.
 * flex: 1을 사용하여 남은 공간을 모두 차지합니다.
 */
const Left = styled.div`
  width: 172px;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ChartWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 172px;
  height: 172px;
`;

const Right = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const ChartLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 98px;
  height: 98px;
  border-radius: 50%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #22242c;
`;

const ChartLabelItem = styled.div`
  width: 66px;

  & + & {
    margin-top: 8px;
    padding-top: 5px;
    border-top: 1px solid #5d6278;
  }
`;

const ChartTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #f5f5f5;
  text-align: center;
`;

const ChartPercent = styled.div`
  font-weight: 600;
  font-size: 20px;
  text-align: center;
  color: #f5f5f5;
`;

const RightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding-bottom: 10px;
  border-bottom: 1px solid #292b32;
  margin-bottom: 10px;
`;

const RightBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Record = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Key = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #f5f5f5;
`;

const Value = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 5px;
  color: #bababa;
`;

const TotalCount = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
`;

const TotalUnit = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
`;

const Count = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
`;

const CountUnit = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;
