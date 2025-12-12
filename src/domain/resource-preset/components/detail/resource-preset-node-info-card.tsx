"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import type { ResourcePresetNodeInfoType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";

const gpuInfo = getResourceInfo("GPU");
const cpuInfo = getResourceInfo("CPU");
const memInfo = getResourceInfo("MEM");

interface ResourcePresetNodeInfoCardProps {
  node: ResourcePresetNodeInfoType;
}

/**
 * 자원 프리셋 노드 정보 카드
 *
 * xiilab-ui Card compact를 사용하여 노드 정보를 표시합니다.
 */
export function ResourcePresetNodeInfoCard({
  node,
}: ResourcePresetNodeInfoCardProps) {
  return (
    <Card contentVariant="compact" title={node.nodeName} hoverable={false}>
      <CardBody>
        <ResourceItem>
          {gpuInfo.text} : {node.nodeGpu}
          {gpuInfo.unit}
        </ResourceItem>
        <Divider />
        <ResourceItem>
          {cpuInfo.text} : {node.nodeCpu}
          {cpuInfo.unit}
        </ResourceItem>
        <Divider />
        <ResourceItem>
          {memInfo.text} : {node.nodeMemory}
          {memInfo.unit}
        </ResourceItem>
      </CardBody>
    </Card>
  );
}

const CardBody = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  gap: 10px;


`;

const ResourceItem = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #171b26;
  line-height: 14px;
`;

const Divider = styled.div`
  width: 1px;
  height: 12px;
  background-color: #e9ebee;
`;
