"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { nodeAllocatedResourcesColumn } from "@/components/common/column/node-allocated-resources-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { useGetNodeResources } from "@/hooks/node/use-get-node-resources";
import {
  DetailContentHeader,
  DetailContentKey,
  DetailContentSubTitle,
  DetailContentTitle,
} from "@/styles/layers/detail-page-layers.styled";
import {
  DetailContentFeature,
  DetailContentFeatureBody,
  DetailContentFeaturePane,
  DetailContentFeatureRow,
  DetailContentPane,
  DetailContentPaneBody,
  DetailContentPaneValue,
} from "@/styles/layers/detail-page-vertical-layers.styled";

/**
 * NodeSecondaryPane 컴포넌트
 *
 * 노드 상세 페이지의 리소스 정보를 표시하는 보조 패널 컴포넌트입니다.
 * 노드의 GPU 정보, 용량(Capacity), 할당 가능한 리소스(Allocatable),
 * 할당된 리소스(Allocated resources) 정보를 표시합니다.
 *
 * @returns 노드의 리소스 정보를 표시하는 보조 패널 컴포넌트
 */
export function NodeSecondaryPane() {
  // URL 파라미터에서 노드 이름 추출
  const { name } = useParams();

  // 노드 리소스 정보 조회
  const { data } = useGetNodeResources(String(name));

  // GPU 정보 표시 여부 확인
  const isShowGpuInfo = !!data?.resources.gpuType;

  /**
   * 할당된 리소스 정보를 테이블 형태로 변환하는 함수
   * CPU, Memory, GPU 리소스의 requests와 limits 정보를 포함합니다.
   *
   * @returns 할당된 리소스 정보 배열
   */
  const getAllocatedResources = () => {
    let allocatedResources: any[] = [];
    if (data?.resources.requests && data?.resources.limits) {
      allocatedResources = [
        {
          resourceName: "CPU",
          requests: `${data.resources.requests.cpu}m (${data.resources.requests.cpuPercent}%)`,
          limits: `${data.resources.limits.cpu}m (${data.resources.limits.cpuPercent}%)`,
        },
        {
          resourceName: "Memory",
          requests: `${data.resources.requests.memory}Ki (${data.resources.requests.memoryPercent}%)`,
          limits: `${data.resources.limits.memory}m (${data.resources.limits.memoryPercent}%)`,
        },
        {
          resourceName: "Nvidia.com/GPU",
          requests: `${data.resources.requests.gpu} (${data.resources.requests.gpuPercent}%)`,
          limits: `${data.resources.limits.gpu} (${data.resources.limits.gpuPercent}%)`,
        },
      ];
    }

    return allocatedResources;
  };

  return (
    <DetailContentPane>
      {/* 리소스 정보 헤더 */}
      <DetailContentHeader>
        <DetailContentTitle>리소스 정보</DetailContentTitle>
      </DetailContentHeader>
      <DetailContentPaneBody>
        {/* GPU 정보가 있는 경우 GPU 정보 섹션 표시 */}
        {isShowGpuInfo && (
          <DetailContentFeature className="first">
            <DetailContentSubTitle>GPU Information</DetailContentSubTitle>
            <DetailContentFeatureBody>
              {/* GPU 기본 정보 (타입, 개수) */}
              <DetailContentFeaturePane>
                <DetailContentFeatureRow>
                  <DetailContentKey>Type</DetailContentKey>
                  <DetailContentPaneValue
                    className="truncate"
                    title={data?.resources.gpuType}
                  >
                    {data?.resources.gpuType}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
                <DetailContentFeatureRow>
                  <DetailContentKey>Count</DetailContentKey>
                  <DetailContentPaneValue
                    className="truncate"
                    title={data?.resources.gpuCount}
                  >
                    {data?.resources.gpuCount}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
              </DetailContentFeaturePane>
              {/* GPU 상세 정보 (메모리, 드라이버 버전) */}
              <DetailContentFeaturePane>
                <DetailContentFeatureRow>
                  <DetailContentKey>Memory</DetailContentKey>
                  <DetailContentPaneValue
                    className="truncate"
                    title={data?.resources.gpuMem}
                  >
                    {data?.resources.gpuMem}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
                <DetailContentFeatureRow>
                  <DetailContentKey>Driver version</DetailContentKey>
                  <DetailContentPaneValue
                    className="truncate"
                    title={data?.resources.gpuDriverVersion}
                  >
                    {data?.resources.gpuDriverVersion}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
              </DetailContentFeaturePane>
            </DetailContentFeatureBody>
          </DetailContentFeature>
        )}
        {/* 노드 용량(Capacity) 정보 섹션 */}
        <DetailContentFeature className={!isShowGpuInfo ? "first" : ""}>
          <DetailContentSubTitle>Capacity</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* CPU, 스토리지, Hugepages 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>CPU</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityCpu}
                >
                  {data?.resources.capacity?.capacityCpu}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Eephemeral storage</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityEphemeralStorage}
                >
                  {data?.resources.capacity?.capacityEphemeralStorage}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Hugepages-1Gi</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityHugepages1Gi}
                >
                  {data?.resources.capacity?.capacityHugepages1Gi}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Hugepages-2Mi</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityHugepages2Mi}
                >
                  {data?.resources.capacity?.capacityHugepages2Mi}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 메모리, GPU, Pods 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Memory</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityMemory}
                >
                  {data?.resources.capacity?.capacityMemory}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Nvidia.com/GPU</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityGpu}
                >
                  {data?.resources.capacity?.capacityGpu}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Pods</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.capacity?.capacityPods}
                >
                  {data?.resources.capacity?.capacityPods}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        {/* 할당 가능한 리소스(Allocatable) 정보 섹션 */}
        <DetailContentFeature className="last">
          <DetailContentSubTitle>Alloctable</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* CPU, 스토리지, Hugepages 할당 가능 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>CPU</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatableCpu}
                >
                  {data?.resources.allocatable?.allocatableCpu}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Eephemeral storage</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={
                    data?.resources.allocatable?.allocatableEphemeralStorage
                  }
                >
                  {data?.resources.allocatable?.allocatableEphemeralStorage}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Hugepages-1Gi</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatableHugepages1Gi}
                >
                  {data?.resources.allocatable?.allocatableHugepages1Gi}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Hugepages-2Mi</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatableHugepages2Mi}
                >
                  {data?.resources.allocatable?.allocatableHugepages2Mi}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* 메모리, GPU, Pods 할당 가능 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Memory</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatableMemory}
                >
                  {data?.resources.allocatable?.allocatableMemory}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Nvidia.com/GPU</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatableGpu}
                >
                  {data?.resources.allocatable?.allocatableGpu}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Pods</DetailContentKey>
                <DetailContentPaneValue
                  className="truncate"
                  title={data?.resources.allocatable?.allocatablePods}
                >
                  {data?.resources.allocatable?.allocatablePods}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
      </DetailContentPaneBody>
      {/* 할당된 리소스 테이블 섹션 */}
      <TableSection>
        <DetailContentFeature className="first last">
          <DetailContentSubTitle>Allocated resources</DetailContentSubTitle>
          <TableWrapper>
            {/* 할당된 리소스 정보를 테이블로 표시 */}
            <CustomizedTable
              columns={nodeAllocatedResourcesColumn}
              data={getAllocatedResources()}
              columnHeight={32}
              bodyBgColor="transparent"
              activePadding
            />
          </TableWrapper>
        </DetailContentFeature>
      </TableSection>
    </DetailContentPane>
  );
}

/**
 * 테이블 섹션 스타일
 * 할당된 리소스 테이블을 표시하는 섹션의 스타일입니다.
 */
const TableSection = styled(DetailContentPaneBody)`
  flex: none;
  height: 203px;
  overflow: hidden;
  margin-top: 8px;
`;

/**
 * 테이블 래퍼 스타일
 * 할당된 리소스 테이블을 감싸는 컨테이너의 스타일입니다.
 */
const TableWrapper = styled.div`
  height: 128px;
`;
