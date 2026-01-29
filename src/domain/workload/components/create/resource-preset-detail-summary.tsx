"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import type { ResourcePresetSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  formatCpuResource,
  formatGpuResource,
  formatMemoryResource,
  getGpuResourceLabel,
} from "@/domain/resource-preset/utils/resource-preset-detail.util";
import {
  AsideDetailArticle,
  AsideDetailArticleBody,
  AsideDetailArticleColumn,
  AsideDetailArticleHeader,
  AsideDetailArticleItem,
  AsideDetailArticleKey,
  AsideDetailArticleTitle,
} from "@/styles/layers/aside-detail-layers.styled";

interface ResourcePresetDetailSummaryProps {
  preset: ResourcePresetSummaryResponse;
}

export function ResourcePresetDetailSummary({
  preset,
}: ResourcePresetDetailSummaryProps) {
  const { resource } = preset;
  const gpuResource = resource.gpu;
  const gpuResourceLabel = getGpuResourceLabel(gpuResource);
  const hasGpuInfo = Boolean(gpuResource?.gpuName);

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

  const resourceRowColumns = resourceRows.map(({ key, label, value }) => (
    <ResourcePresetDetailColumn key={key}>
      <ResourcePresetKey>{label}</ResourcePresetKey>
      <ResourcePresetValue>{value}</ResourcePresetValue>
    </ResourcePresetDetailColumn>
  ));

  return (
    <AsideDetailArticle>
      <AsideDetailArticleBody>
        {hasGpuInfo && (
          <ResourcePresetDetailItem>
            <ResourcePresetHeader>
              <ResourcePresetTitle>GPU 정보</ResourcePresetTitle>
            </ResourcePresetHeader>
            <ResourcePresetDetailColumn>
              <ResourcePresetKey>GPU 이름</ResourcePresetKey>
              <ResourcePresetValue>
                {gpuResource?.gpuName || "-"}
              </ResourcePresetValue>
            </ResourcePresetDetailColumn>
          </ResourcePresetDetailItem>
        )}

        <ResourcePresetDetailItem>
          <ResourcePresetHeader>
            <ResourcePresetTitle>리소스 정보</ResourcePresetTitle>
          </ResourcePresetHeader>
          {resourceRowColumns}
        </ResourcePresetDetailItem>
      </AsideDetailArticleBody>
    </AsideDetailArticle>
  );
}

const ResourcePresetDetailItem = styled(AsideDetailArticleItem)`
  & + & {
    margin-top: 14px;
    border-top: none;
  }
`;

const ResourcePresetHeader = styled(AsideDetailArticleHeader)`
  margin-bottom: 8px;
`;

const ResourcePresetTitle = styled(AsideDetailArticleTitle)`
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  color: #484848;
`;

const ResourcePresetDetailColumn = styled(AsideDetailArticleColumn)`
margin-top: 10px;
  gap: 10px;
`;

const ResourcePresetKey = styled(AsideDetailArticleKey)`
  width: 100px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
  color: #484848;
`;

const ResourcePresetValue = styled(Typography.Text).attrs({
  variant: "subtitle-2-3",
})`
  flex: 1;
  overflow: hidden;
  word-wrap: break-word;
  color: #000;
`;
