import styled from "styled-components";

import { useGetClusterResourceSummary } from "@/api/generated/admin-cluster/admin-cluster";
import type { ClusterResourceSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type ClusterResourceData,
  MonitoringClusterResource,
} from "@/domain/monitoring/components/monitoring-cluster-resource";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { ClusterResourceInfoTooltipTitle } from "@/shared/components/tooltip-title/cluster-resource-info-tooltip-content";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { convertBytes } from "@/shared/utils/resource.util";
import { UserMonitoringSectionTitle } from "@/styles/layers/user-monitoring-layers.styled";

function bytesToGb(bytes: string | undefined): number | undefined {
  if (bytes == null || bytes === "") return undefined;

  const numBytes = Number(bytes);
  if (!Number.isFinite(numBytes)) return undefined;

  return convertBytes(numBytes, "GB", 0).value;
}

/**
 * API 응답에서 리소스별 데이터 추출
 */
function getClusterResourceData(
  data: ClusterResourceSummaryResponse | undefined,
  resourceType: CoreResourceType,
): ClusterResourceData {
  if (!data) return {};

  switch (resourceType) {
    case "GPU":
      return {
        total: data.gpu?.detail?.normal?.clusterCapacityCount,
        requested: data.gpu?.detail?.normal?.requestedCount,
        used: data.gpu?.detail?.normal?.usedCount,
      };
    case "MIG":
    case "MPS":
      // API 타입 불일치로 빈 객체 반환
      return {};
    case "CPU":
      return {
        total: data.cpu?.clusterCapacityCores,
        requested: data.cpu?.requestedCores,
        used: data.cpu?.usedCores,
      };
    case "MEM":
      return {
        total: bytesToGb(data.memory?.clusterCapacityBytes),
        requested: bytesToGb(data.memory?.requestedBytes),
        used: bytesToGb(data.memory?.usedBytes),
      };
    case "DISK":
      return {
        total: bytesToGb(data.disk?.clusterCapacityBytes),
        used: bytesToGb(data.disk?.usedBytes),
      };
    default:
      return {};
  }
}

export function MonitoringClusterResourceSection() {
  const { data: summaryData } = useGetClusterResourceSummary();

  return (
    <Container>
      <Header>
        <UserMonitoringSectionTitle>
          클러스터 리소스 정보
        </UserMonitoringSectionTitle>
        <GuideTooltip
          title={<ClusterResourceInfoTooltipTitle />}
          iconSize={22}
          placement="right"
        />
      </Header>
      <Body>
        <ResourceRow>
          <MonitoringClusterResource
            gradientToColors={[
              "var(--gpu-usage-color)",
              "var(--gpu-request-color)",
            ]}
            resourceType="GPU"
            data={getClusterResourceData(summaryData, "GPU")}
          />
          <MonitoringClusterResource
            gradientToColors={[
              "var(--gpu-usage-color)",
              "var(--gpu-request-color)",
            ]}
            resourceType="MIG"
            data={getClusterResourceData(summaryData, "MIG")}
          />
          <MonitoringClusterResource
            gradientToColors={[
              "var(--gpu-usage-color)",
              "var(--gpu-request-color)",
            ]}
            resourceType="MPS"
            data={getClusterResourceData(summaryData, "MPS")}
          />
        </ResourceRow>
        <ResourceColumn>
          <MonitoringClusterResource
            gradientToColors={[
              "var(--cpu-usage-color)",
              "var(--cpu-request-color)",
            ]}
            resourceType="CPU"
            data={getClusterResourceData(summaryData, "CPU")}
          />
        </ResourceColumn>
        <ResourceColumn>
          <MonitoringClusterResource
            gradientToColors={[
              "var(--mem-usage-color)",
              "var(--mem-request-color)",
            ]}
            resourceType="MEM"
            data={getClusterResourceData(summaryData, "MEM")}
          />
        </ResourceColumn>
        <ResourceColumn>
          <MonitoringClusterResource
            gradientToColors={[
              "var(--disk-usage-color)",
              "var(--disk-request-color)",
            ]}
            resourceType="DISK"
            data={getClusterResourceData(summaryData, "DISK")}
          />
        </ResourceColumn>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  min-width: 892px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  padding-left: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

const Body = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 10px;
  row-gap: 8px;
`;

const ResourceRow = styled.div`
  grid-column: 1 / -1;
  border: 1px solid #292b32;
  border-radius: 4px;
  height: 178px;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;
`;

const ResourceColumn = styled(ResourceRow)`
  grid-column: span 1;
`;
