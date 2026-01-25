"use client";

import styled from "styled-components";

import type { ClusterNodeDetailResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { nodeAllocatedResourcesColumn } from "@/shared/components/column/node-allocated-resources-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
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

interface NodeSecondaryPaneProps {
  data?: ClusterNodeDetailResponse;
}

/**
 * NodeSecondaryPane 컴포넌트
 *
 * 노드 상세 페이지의 리소스 정보를 표시하는 보조 패널 컴포넌트입니다.
 * 노드의 GPU 정보, 용량(Capacity), 할당 가능한 리소스(Allocatable),
 * 할당된 리소스(Allocated resources) 정보를 표시합니다.
 *
 * @param data - 노드 상세 정보
 * @returns 노드의 리소스 정보를 표시하는 보조 패널 컴포넌트
 */
export function NodeSecondaryPane({ data }: NodeSecondaryPaneProps) {
  // 첫 번째 GPU 정보 추출
  const gpuInfo = data?.gpuInfo?.[0];
  // GPU 정보 표시 여부 확인
  const isShowGpuInfo = !!gpuInfo?.gpuType;

  /**
   * 할당된 리소스 정보를 테이블 형태로 변환하는 함수
   * CPU, Memory, GPU 리소스의 requests와 limits 정보를 포함합니다.
   *
   * @returns 할당된 리소스 정보 배열
   */
  const getAllocatedResources = () => {
    if (!data?.allocatedResource) return [];

    return data.allocatedResource.map((resource) => ({
      id: resource.resourceName.toLowerCase(),
      resourceName: resource.resourceName,
      requests: `${resource.request} (${resource.requestPercent}%)`,
      limits: `${resource.limit} (${resource.limitPercent}%)`,
    }));
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
                    title={gpuInfo?.gpuType || undefined}
                  >
                    {gpuInfo?.gpuType || "-"}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
                <DetailContentFeatureRow>
                  <DetailContentKey>Count</DetailContentKey>
                  <DetailContentPaneValue className="truncate">
                    {gpuInfo?.gpuCount ? `${gpuInfo.gpuCount}개` : "-"}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
              </DetailContentFeaturePane>
              {/* GPU 상세 정보 (메모리, 드라이버 버전) */}
              <DetailContentFeaturePane>
                <DetailContentFeatureRow>
                  <DetailContentKey>Memory</DetailContentKey>
                  <DetailContentPaneValue className="truncate">
                    {gpuInfo?.gpuMemoryMb ? `${gpuInfo.gpuMemoryMb}MB` : "-"}
                  </DetailContentPaneValue>
                </DetailContentFeatureRow>
                <DetailContentFeatureRow>
                  <DetailContentKey>Driver version</DetailContentKey>
                  <DetailContentPaneValue className="truncate">
                    {gpuInfo?.gpuDriverVersion || "-"}
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
            {/* CPU, 메모리, 스토리지 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>CPU</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.capacity?.cpu ? `${data.capacity.cpu}개` : "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Memory</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.capacity?.memory || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Ephemeral storage</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.capacity?.["ephemeral-storage"] || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* GPU, Pods 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Nvidia.com/GPU</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.capacity?.["nvidia.com/gpu"] || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Pods</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.capacity?.pods || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow></DetailContentFeatureRow>
            </DetailContentFeaturePane>
          </DetailContentFeatureBody>
        </DetailContentFeature>
        {/* 할당 가능한 리소스(Allocatable) 정보 섹션 */}
        <DetailContentFeature className="last">
          <DetailContentSubTitle>Allocatable</DetailContentSubTitle>
          <DetailContentFeatureBody>
            {/* CPU, 메모리, 스토리지 할당 가능 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>CPU</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.allocatable?.cpu ? `${data.allocatable.cpu}개` : "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Memory</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.allocatable?.memory || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Ephemeral storage</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.allocatable?.["ephemeral-storage"] || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
            </DetailContentFeaturePane>
            {/* GPU, Pods 할당 가능 정보 */}
            <DetailContentFeaturePane>
              <DetailContentFeatureRow>
                <DetailContentKey>Nvidia.com/GPU</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.allocatable?.["nvidia.com/gpu"] || "-"}
                </DetailContentPaneValue>
              </DetailContentFeatureRow>
              <DetailContentFeatureRow>
                <DetailContentKey>Pods</DetailContentKey>
                <DetailContentPaneValue className="truncate">
                  {data?.allocatable?.pods || "-"}
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
  height: 500px;
  overflow: hidden;
  margin-top: 8px;
`;

/**
 * 테이블 래퍼 스타일
 * 할당된 리소스 테이블을 감싸는 컨테이너의 스타일입니다.
 */
const TableWrapper = styled.div`
  height: 423px;
`;
