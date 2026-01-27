"use client";

import styled from "styled-components";
import { Button } from "xiilab-ui";

import type { ResourcePresetResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  formatCpuResource,
  formatGpuResource,
  formatMemoryResource,
  getGpuResourceLabel,
  getJobTypeLabel,
  getNodeTypeLabel,
} from "@/domain/resource-preset/utils/resource-preset-detail.util";
import { CustomScrollbars } from "@/shared/components/custom-scrollbars";
import { formatDateSafely } from "@/shared/utils/date.util";
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

interface ResourcePresetDetailViewProps {
  data: ResourcePresetResponse;
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
  const { resource } = data;
  const gpuResource = resource.gpu;
  const jobTypeLabel = getJobTypeLabel(data.workloadJobType);

  const gpuResourceLabel = getGpuResourceLabel(gpuResource);

  const resourceRows = [
    {
      key: "gpu",
      label: gpuResourceLabel,
      value: formatGpuResource(gpuResource),
    },
    {
      key: "cpu",
      label: "CPU",
      value: formatCpuResource(resource.cpu.requestCore),
    },
    {
      key: "memory",
      label: "Memory",
      value: formatMemoryResource(resource.memory.requestByte),
    },
  ];

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
                  <AsideDetailArticleValue>
                    {data.presetName}
                  </AsideDetailArticleValue>
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
                    {jobTypeLabel}
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
                {gpuResource?.gpuName && (
                  <AsideDetailArticleColumn>
                    <ResourcePresetKey>GPU 이름</ResourcePresetKey>
                    <GpuNameValue>
                      <GpuNameText>{gpuResource?.gpuName || "-"}</GpuNameText>
                    </GpuNameValue>
                  </AsideDetailArticleColumn>
                )}
              </AsideDetailArticleItem>

              {/* 리소스 정보 */}
              <AsideDetailArticleItem>
                <AsideDetailArticleHeader>
                  <AsideDetailArticleTitle>리소스 정보</AsideDetailArticleTitle>
                </AsideDetailArticleHeader>

                {resourceRows.map(({ key, label, value }) => (
                  <AsideDetailArticleColumn key={key}>
                    <ResourcePresetKey>{label}</ResourcePresetKey>
                    <AsideDetailArticleValue>{value}</AsideDetailArticleValue>
                  </AsideDetailArticleColumn>
                ))}
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
                        {data.creatorName ?? "-"}
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
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #000;
`;

const GpuNameText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ResourcePresetKey = styled(AsideDetailArticleKey)`
  width: 100px;
`;

/**
 * 헤더 버튼 그룹
 */
const HeaderButtonGroup = styled.div`
  display: flex;
  gap: 4px;
`;
