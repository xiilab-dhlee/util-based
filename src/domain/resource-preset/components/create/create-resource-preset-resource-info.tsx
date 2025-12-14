"use client";

import styled from "styled-components";
import { Form, FormItem, InputNumber, Typography } from "xiilab-ui";

import {
  DISTRIBUTED_TYPE_OPTIONS,
  NODE_COUNT_RANGE,
  WORKER_RESOURCE_MAX,
} from "@/domain/resource-preset/constants/resource-preset.constant";
import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import {
  isGpuCountFixed,
  showDistributedSection,
  showSingleNodeResource,
} from "@/domain/resource-preset/utils/resource-preset.rules";
import { SelectableBox } from "@/shared/components/selectable-box";
import { Slider } from "@/shared/components/slider";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

/* =============================================================================
   메인 컴포넌트
============================================================================= */

export function CreateResourcePresetResourceInfo() {
  // Hook으로 폼 상태 및 메서드 가져오기
  const { form, updateSingleNodeResource, updateMultiNodeResource } =
    useResourcePresetForm();

  // 폼 상태 추출
  const {
    nodeType,
    selectedNode,
    gpuType,
    singleNodeResource,
    multiNodeResource,
  } = form;
  const { gpu, cpu, memory } = singleNodeResource;
  const { distributedType, nodeCount, workerGpu, workerCpu, workerMemory } =
    multiNodeResource;
  // 비즈니스 룰 적용
  const shouldShowSingleNode = showSingleNodeResource(nodeType);
  const shouldShowMultiNode = showDistributedSection(nodeType);
  const isGpuFixed = isGpuCountFixed(gpuType);

  // Single Node: 최대값은 선택된 노드의 리소스 값
  const maxGpu = selectedNode?.gpuTotal ?? 0;
  const maxCpu = selectedNode?.cpuTotal ?? 0;
  const maxMemory = selectedNode?.memoryTotal ?? 0;
  const isSingleNodeDisabled = !selectedNode;

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>리소스 정보</CreateWorkloadSectionTitle>
      </FormSectionHeader>

      {/* Single Node 리소스 UI */}
      {shouldShowSingleNode && (
        <SliderContainer>
          <SliderRow>
            <SliderLabel>
              <Typography.Text variant="body-2-3" color="#484848">
                GPU
              </Typography.Text>
            </SliderLabel>
            <SliderWrapper>
              <Slider
                min={0}
                max={maxGpu}
                value={gpu}
                onChange={(value) => updateSingleNodeResource({ gpu: value })}
                type="GPU"
                width="100%"
                disabled={isSingleNodeDisabled}
                readOnly={isGpuFixed}
              />
            </SliderWrapper>
          </SliderRow>

          <SliderRow>
            <SliderLabel>
              <Typography.Text variant="body-2-3" color="#484848">
                CPU
              </Typography.Text>
            </SliderLabel>
            <SliderWrapper>
              <Slider
                min={0}
                max={maxCpu}
                value={cpu}
                onChange={(value) => updateSingleNodeResource({ cpu: value })}
                type="CPU"
                width="100%"
                disabled={isSingleNodeDisabled}
              />
            </SliderWrapper>
          </SliderRow>

          <SliderRow>
            <SliderLabel>
              <Typography.Text variant="body-2-3" color="#484848">
                Memory
              </Typography.Text>
            </SliderLabel>
            <SliderWrapper>
              <Slider
                min={0}
                max={maxMemory}
                value={memory}
                onChange={(value) =>
                  updateSingleNodeResource({ memory: value })
                }
                type="MEM"
                width="100%"
                disabled={isSingleNodeDisabled}
              />
            </SliderWrapper>
          </SliderRow>
        </SliderContainer>
      )}

      {/* Multi Node 리소스 UI */}
      {shouldShowMultiNode && (
        <Form layout="vertical">
          {/* 분산 학습 타입 선택 */}
          <FormItem label="분산 학습 타입" required>
            <ButtonGrid>
              {DISTRIBUTED_TYPE_OPTIONS.map((option) => (
                <SelectableBox
                  key={option.id}
                  title={option.label}
                  meta={
                    <DistributedTypeDescription>
                      {option.description}
                    </DistributedTypeDescription>
                  }
                  isSelected={distributedType === option.id}
                  onClick={() =>
                    updateMultiNodeResource({ distributedType: option.id })
                  }
                  height="64px"
                  direction="column"
                />
              ))}
            </ButtonGrid>
          </FormItem>

          {/* 분산 학습 구성 */}
          <FormItem label="분산 학습 구성">
            <NodeCountRow>
              <Typography.Text variant="body-2-3" color="#484848">
                노드 수
              </Typography.Text>
              <NodeCountInputWrapper>
                <InputNumber
                  value={nodeCount}
                  onChange={(value) => {
                    const numValue =
                      typeof value === "number" ? value : NODE_COUNT_RANGE.min;
                    updateMultiNodeResource({ nodeCount: numValue });
                  }}
                  min={NODE_COUNT_RANGE.min}
                  max={NODE_COUNT_RANGE.max}
                  width={80}
                />
                <Typography.Text variant="body-3-3" color="#484848">
                  개
                </Typography.Text>
              </NodeCountInputWrapper>
            </NodeCountRow>
          </FormItem>

          {/* Worker 리소스 */}
          <WorkerSection>
            <WorkerHeader>
              <Typography.Text variant="subtitle-2-1" color="#484848">
                Worker
              </Typography.Text>
            </WorkerHeader>

            <SliderRow>
              <SliderLabel>
                <Typography.Text variant="body-2-3" color="#484848">
                  GPU
                </Typography.Text>
              </SliderLabel>
              <SliderWrapper>
                <Slider
                  min={0}
                  max={WORKER_RESOURCE_MAX.gpu}
                  value={workerGpu}
                  onChange={(value) =>
                    updateMultiNodeResource({ workerGpu: value })
                  }
                  type="GPU"
                  width="100%"
                />
              </SliderWrapper>
            </SliderRow>

            <SliderRow>
              <SliderLabel>
                <Typography.Text variant="body-2-3" color="#484848">
                  CPU
                </Typography.Text>
              </SliderLabel>
              <SliderWrapper>
                <Slider
                  min={0}
                  max={WORKER_RESOURCE_MAX.cpu}
                  value={workerCpu}
                  onChange={(value) =>
                    updateMultiNodeResource({ workerCpu: value })
                  }
                  type="CPU"
                  width="100%"
                />
              </SliderWrapper>
            </SliderRow>

            <SliderRow>
              <SliderLabel>
                <Typography.Text variant="body-2-3" color="#484848">
                  Memory
                </Typography.Text>
              </SliderLabel>
              <SliderWrapper>
                <Slider
                  min={0}
                  max={WORKER_RESOURCE_MAX.memory}
                  value={workerMemory}
                  onChange={(value) =>
                    updateMultiNodeResource({ workerMemory: value })
                  }
                  type="MEM"
                  width="100%"
                />
              </SliderWrapper>
            </SliderRow>
          </WorkerSection>
        </Form>
      )}
    </FormSectionContainer>
  );
}

/* =============================================================================
   스타일 컴포넌트
============================================================================= */

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SliderLabel = styled.div`
  width: 50px;
  flex-shrink: 0;
`;

const SliderWrapper = styled.div`
  flex: 1;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
`;

const DistributedTypeDescription = styled.span`
  font-family: Pretendard, sans-serif;
  font-weight: 400;
  font-size: 11px;
  line-height: 1.4;
  color: #787878;
`;

const NodeCountRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NodeCountInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WorkerSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
`;

const WorkerHeader = styled.div`
  margin-bottom: 4px;
`;
