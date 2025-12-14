"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";
import { Tag } from "xiilab-ui";

import { ResourcePresetNodeInfoCard } from "@/domain/resource-preset/components/detail/resource-preset-node-info-card";
import { useGetResourcePresetDetail } from "@/domain/resource-preset/hooks/use-get-resource-preset-detail";
import {
  type ResourcePresetDetailResponseType,
  resourcePresetGpuTypeValues,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
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
  AsideDetailContainer,
  AsideDetailEmpty,
  AsideDetailHeader,
  AsideDetailHeaderTitle,
} from "@/styles/layers/aside-detail-layers.styled";

const GPU_RESOURCE_TYPE = "GPU" as const;
const CPU_RESOURCE_TYPE = "CPU" as const;
const MEM_RESOURCE_TYPE = "MEM" as const;

const gpuInfo = getResourceInfo(GPU_RESOURCE_TYPE);
const cpuInfo = getResourceInfo(CPU_RESOURCE_TYPE);
const memInfo = getResourceInfo(MEM_RESOURCE_TYPE);

/**
 * 리소스 프리셋 상세 컴포넌트
 *
 * URL params의 id를 통해 리소스 프리셋의 상세 정보를 표시하는 컴포넌트입니다.
 */
export function ResourcePresetDetailMain() {
  const params = useParams<{ id: string }>();
  const presetId = params.id;

  const { data } = useGetResourcePresetDetail(presetId);

  const getNodeTypeLabel = (nodeType: string) => {
    return nodeType === "single" ? "Single Node" : "Multi Node";
  };

  const getJobTypeLabel = (
    jobType: ResourcePresetDetailResponseType["jobType"],
  ) => {
    const labels = {
      BATCH: "Batch Job",
      INTERACTIVE: "Interactive Job",
      DISTRIBUTED: "Distributed Job",
    };
    return labels[jobType];
  };

  return (
    <AsideDetailContainer>
      {/* 드로어 헤더 - 제목과 닫기 버튼 */}
      <AsideDetailHeader>
        <AsideDetailHeaderTitle>리소스 프리셋 상세</AsideDetailHeaderTitle>
      </AsideDetailHeader>

      {/* 리소스 프리셋 상세 정보 아티클 */}
      <AsideDetailArticle>
        {!data ? (
          <AsideDetailEmpty>
            <EmptyState
              title="선택된 리소스 프리셋이 없습니다"
              content="좌측 목록에서 리소스 프리셋을 선택해주세요."
            />
          </AsideDetailEmpty>
        ) : (
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
                  {getJobTypeLabel(data.jobType)}
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
                  {(data.gpuType === resourcePresetGpuTypeValues[1] ||
                    data.gpuType === resourcePresetGpuTypeValues[2]) && (
                    <Tag variant="gray">{data.gpuType}</Tag>
                  )}
                  {data.gpuName}
                </GpuNameValue>
              </AsideDetailArticleColumn>

              <AsideDetailArticleColumn>
                <ResourcePresetKey>Memory</ResourcePresetKey>
                <AsideDetailArticleValue>
                  {data.gpuMemory} {memInfo.unit}
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
        )}
      </AsideDetailArticle>
    </AsideDetailContainer>
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
