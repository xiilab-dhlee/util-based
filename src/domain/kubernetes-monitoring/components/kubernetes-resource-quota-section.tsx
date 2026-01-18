import styled from "styled-components";

import { useGetClusterResourceSummary } from "@/api/generated/admin-cluster/admin-cluster";
import type { ClusterResourceSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { KubernetesResourceQuotaCard } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-quota-card";
import type { CoreResourceType } from "@/shared/types/core.interface";
import { convertBytes } from "@/shared/utils/resource.util";

function bytesToGb(bytes: string | undefined): number | undefined {
  if (bytes == null || bytes === "") return undefined;

  const numBytes = Number(bytes);
  if (!Number.isFinite(numBytes)) return undefined;

  return convertBytes(numBytes, "GB", 0).value;
}

/**
 * API 응답에서 리소스별 total/quota 추출
 */
function getResourceValues(
  data: ClusterResourceSummaryResponse | undefined,
  resourceName: CoreResourceType,
): { total?: number; quota?: number } {
  if (!data) return {};

  switch (resourceName) {
    case "GPU":
      return {
        total: data.gpu?.detail?.normal?.clusterCapacityCount,
        quota: data.gpu?.detail?.normal?.usedCount,
      };
    case "MIG":
    case "MPS":
      // API 타입 불일치로 '-' 처리
      return {};
    case "CPU":
      return {
        total: data.cpu?.clusterCapacityCores,
        quota: data.cpu?.usedCores,
      };
    case "MEM":
      return {
        total: bytesToGb(data.memory?.clusterCapacityBytes),
        quota: bytesToGb(data.memory?.usedBytes),
      };
    case "DISK":
      return {
        total: bytesToGb(data.disk?.clusterCapacityBytes),
        quota: bytesToGb(data.disk?.usedBytes),
      };
    default:
      return {};
  }
}

export function KubernetesResourceQuotaSection() {
  const { data: summaryData } = useGetClusterResourceSummary();

  const gpuValues = getResourceValues(summaryData, "GPU");
  const migValues = getResourceValues(summaryData, "MIG");
  const mpsValues = getResourceValues(summaryData, "MPS");
  const cpuValues = getResourceValues(summaryData, "CPU");
  const memValues = getResourceValues(summaryData, "MEM");
  const diskValues = getResourceValues(summaryData, "DISK");

  return (
    <QuotaBody>
      <QuotaPane>
        <KubernetesResourceQuotaCard
          resourceName="GPU"
          total={gpuValues.total}
          quota={gpuValues.quota}
          showDivider
        />
        <KubernetesResourceQuotaCard
          resourceName="MIG"
          total={migValues.total}
          quota={migValues.quota}
        />
        <KubernetesResourceQuotaCard
          resourceName="MPS"
          total={mpsValues.total}
          quota={mpsValues.quota}
        />
      </QuotaPane>
      <QuotaPane>
        <KubernetesResourceQuotaCard
          resourceName="CPU"
          total={cpuValues.total}
          quota={cpuValues.quota}
        />
        <KubernetesResourceQuotaCard
          resourceName="MEM"
          total={memValues.total}
          quota={memValues.quota}
        />
        <KubernetesResourceQuotaCard
          resourceName="DISK"
          total={diskValues.total}
          quota={diskValues.quota}
        />
      </QuotaPane>
    </QuotaBody>
  );
}

const QuotaBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin: 20px 0;
`;

const QuotaPane = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border: 1px solid #e0e0e0;
  background-color: #f7f9fb;
  border-radius: 4px;
`;
