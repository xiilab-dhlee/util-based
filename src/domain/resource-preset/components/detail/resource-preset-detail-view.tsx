"use client";

import styled from "styled-components";
import { Button, Tag } from "xiilab-ui";

import { ResourcePresetNodeInfoCard } from "@/domain/resource-preset/components/detail/resource-preset-node-info-card";
import type { ResourcePresetDetailResponseType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { WORKLOAD_JOB_TYPE_LABEL_MAP } from "@/domain/workload/constants/workload.constant";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { Slider } from "@/shared/components/slider/custom-slider";
import { formatDateSafely } from "@/shared/utils/date.util";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleRow,
  AsideDetailArticleRowItem,
  AsideDetailArticleTitle,
  AsideDetailArticleValue,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
  AsideDetailScrollWrapper,
} from "@/styles/layers/aside-detail-layers.styled";

const GPU_RESOURCE_TYPE = "GPU" as const;
const GPU_MEMORY_RESOURCE_TYPE = "GPU_MEMORY" as const;
const CPU_RESOURCE_TYPE = "CPU" as const;
const MEM_RESOURCE_TYPE = "MEM" as const;

/** Tag를 표시해야 하는 GPU 타입 (MIG, MPS) */
const GPU_TYPES_WITH_TAG: ReadonlySet<string> = new Set(["MIG", "MPS"]);

const gpuInfo = getResourceInfo(GPU_RESOURCE_TYPE);
const gpuMemoryInfo = getResourceInfo(GPU_MEMORY_RESOURCE_TYPE);
const cpuInfo = getResourceInfo(CPU_RESOURCE_TYPE);
const memInfo = getResourceInfo(MEM_RESOURCE_TYPE);

interface ResourcePresetDetailViewProps {
  data: ResourcePresetDetailResponseType;
  onUpdate: () => void;
  onDelete: () => void;
}

/**
 * 리소스 프리셋 조회 컴포넌트
 *
 * 읽기 전용으로 리소스 프리셋의 상세 정보를 표시합니다.
 */
export function ResourcePresetDetailView({
  data,
  onUpdate,
  onDelete,
}: ResourcePresetDetailViewProps) {
  const getNodeTypeLabel = (nodeType: string) => {
    return nodeType === "single" ? "Single Node" : "Multi Node";
  };

  return (
    <>
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>리소스 프리셋 상세</AsideDetailHeaderTitle>
        <HeaderButtonGroup>
          <Button icon="Edit02" onClick={onUpdate} />
          <Button icon="Delete" onClick={onDelete} />
        </HeaderButtonGroup>
      </AsideDetailHeader>

      <AsideDetailScrollWrapper>
        <CustomScrollbars>
          <AsideDetailArticle>
            <AsideDetailArticleBody>
              {/* 기본 정보 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>기본 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>리소스 프리셋 이름</ResourcePresetKey>
                  <AsideDetailArticleValue>{data.name}</AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>설명</ResourcePresetKey>
                  <AsideDetailArticleValue>
                    {data.description ?? "-"}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleItem>

              {/* Job Type */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>Job Type</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>Job Type</ResourcePresetKey>
                  <AsideDetailArticleValue>
                    {WORKLOAD_JOB_TYPE_LABEL_MAP[data.jobType]} Job
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>
              </AsideDetailArticleItem>

              {/* GPU 정보 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>GPU 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>노드</ResourcePresetKey>
                  <AsideDetailArticleValue>
                    {getNodeTypeLabel(data.nodeType)}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>GPU 이름</ResourcePresetKey>
                  <GpuNameValue>
                    {GPU_TYPES_WITH_TAG.has(data.gpuType) && (
                      <Tag variant="gray">{data.gpuType}</Tag>
                    )}
                    {data.gpuName}
                  </GpuNameValue>
                </AsideDetailArticleColumn>

                <AsideDetailArticleColumn>
                  <ResourcePresetKey>Memory</ResourcePresetKey>
                  <AsideDetailArticleValue>
                    {data.gpuMemory} {gpuMemoryInfo.unit}
                  </AsideDetailArticleValue>
                </AsideDetailArticleColumn>

                {/* 노드 정보 카드 목록 */}
                <NodeInfoColumn>
                  <ResourcePresetKey>노드 정보</ResourcePresetKey>
                  <NodeInfoCardsContainer>
                    {data.nodes.map((node, index) => (
                      <ResourcePresetNodeInfoCard
                        key={`${node.nodeName}-${index}`}
                        node={node}
                      />
                    ))}
                  </NodeInfoCardsContainer>
                </NodeInfoColumn>
              </AsideDetailArticleItem>

              {/* 리소스 정보 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>리소스 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <ResourceSliderContainer>
                  <ResourceSliderRow>
                    <ResourceSliderLabel>{gpuInfo.text}</ResourceSliderLabel>
                    <Slider
                      type={GPU_RESOURCE_TYPE}
                      value={data.gpu}
                      min={0}
                      max={data.gpuMax}
                      readMode
                      width="100%"
                    />
                  </ResourceSliderRow>

                  <ResourceSliderRow>
                    <ResourceSliderLabel>{cpuInfo.text}</ResourceSliderLabel>
                    <Slider
                      type={CPU_RESOURCE_TYPE}
                      value={data.cpu}
                      min={0}
                      max={data.cpuMax}
                      readMode
                      width="100%"
                    />
                  </ResourceSliderRow>

                  <ResourceSliderRow>
                    <ResourceSliderLabel>{memInfo.text}</ResourceSliderLabel>
                    <Slider
                      type={MEM_RESOURCE_TYPE}
                      value={data.memory}
                      min={0}
                      max={data.memoryMax}
                      readMode
                      width="100%"
                    />
                  </ResourceSliderRow>
                </ResourceSliderContainer>
              </AsideDetailArticleItem>

              {/* 생성 정보 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>생성 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                <AsideDetailArticleRow>
                  <AsideDetailArticleRowItem>
                    <AsideDetailArticleColumn>
                      <ResourcePresetKey>생성자</ResourcePresetKey>
                      <AsideDetailArticleValue>
                        {data.creatorName}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                  <AsideDetailArticleRowItem>
                    <AsideDetailArticleColumn>
                      <ResourcePresetKey>생성일</ResourcePresetKey>
                      <AsideDetailArticleValue>
                        {formatDateSafely(data.createdAt) ?? "-"}
                      </AsideDetailArticleValue>
                    </AsideDetailArticleColumn>
                  </AsideDetailArticleRowItem>
                </AsideDetailArticleRow>
              </AsideDetailArticleItem>
            </AsideDetailArticleBody>
          </AsideDetailArticle>
        </CustomScrollbars>
      </AsideDetailScrollWrapper>
    </>
  );
}

/**
 * GPU 이름 값 (Tag + 이름)
 */
const GpuNameValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #000;
`;

/**
 * 노드 정보 카드 컨테이너
 */
const NodeInfoCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

/**
 * 리소스 슬라이더 컨테이너
 */
const ResourceSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

/**
 * 리소스 슬라이더 행
 */
const ResourceSliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

/**
 * 리소스 슬라이더 라벨
 */
const ResourceSliderLabel = styled.span`
  width: 50px;
  font-size: 12px;
  font-weight: 500;
  color: #484848;
`;

const ResourcePresetKey = styled(AsideDetailArticleKey)`
  width: 100px;
`;

/**
 * 노드 정보 컬럼 (상단 정렬)
 */
const NodeInfoColumn = styled(AsideDetailArticleColumn)`
  align-items: flex-start;
`;

/**
 * 헤더 버튼 그룹
 */
const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;
