"use client";

import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import { Form, FormItem, Icon } from "xiilab-ui";

import { MigProfileSelectDropdown } from "@/domain/resource-preset/components/create/dropdowns/mig-profile-select-dropdown";
import { NodeSelectDropdown } from "@/domain/resource-preset/components/create/dropdowns/node-select-dropdown";
import {
  GPU_TYPE_OPTIONS,
  getGpuSelectLabel,
  NODE_TYPE_OPTIONS,
} from "@/domain/resource-preset/constants/gpu-info.constant";
import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import type { ResourcePresetGpuType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import {
  INITIAL_SINGLE_NODE_RESOURCE,
  openCreateResourcePresetDrawerAtom,
} from "@/domain/resource-preset/state/resource-preset-form.atom";
import {
  isMultiNodeEnabled,
  showGpuNodeDropdown,
} from "@/domain/resource-preset/utils/resource-preset.rules";
import {
  SelectableBox,
  SelectableBoxMeta,
} from "@/shared/components/selectable-box";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { useGetGpuNodes } from "@/shared/hooks/use-get-gpu-nodes";
import { useGetGpuProfiles } from "@/shared/hooks/use-get-gpu-profiles";
import { useGetGpus } from "@/shared/hooks/use-get-gpus";
import type {
  GpuListType,
  GpuProfileListType,
} from "@/shared/schemas/gpu.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

/* =============================================================================
   메인 컴포넌트
============================================================================= */

export function CreateResourcePresetGpuInfo() {
  // Drawer 열림 상태
  const isDrawerOpen = useAtomValue(openCreateResourcePresetDrawerAtom);

  // 초기화 완료 플래그 (Drawer가 열릴 때마다 리셋)
  const hasInitialized = useRef(false);

  // Hook으로 폼 상태 및 메서드 가져오기
  const {
    form,
    errors,
    setNodeType,
    setGpuType,
    setSelectedGpu,
    selectNode,
    selectProfile,
    updateSingleNodeResource,
  } = useResourcePresetForm();

  // 폼 상태 추출
  const {
    jobType,
    nodeType,
    gpuType,
    selectedGpu,
    selectedNode,
    selectedProfile,
  } = form;

  // API 데이터
  const { data: gpuData } = useGetGpus();
  const { data: gpuNodeData, isLoading: isLoadingNodes } = useGetGpuNodes();
  const { data: gpuProfileData, isLoading: isLoadingProfiles } =
    useGetGpuProfiles();

  // Drawer가 열렸을 때 초기 GPU/Node 자동 선택
  useEffect(() => {
    // Drawer가 닫혀있으면 초기화 플래그 리셋
    if (!isDrawerOpen) {
      hasInitialized.current = false;
      return;
    }

    // 이미 초기화했거나, 데이터가 없거나, 로딩 중이면 스킵
    if (
      hasInitialized.current ||
      !gpuData?.content.length ||
      !gpuNodeData?.content.length
    ) {
      return;
    }

    // 첫 번째 NORMAL GPU 찾기
    const normalGpus = gpuData.content.filter((gpu) => gpu.type === "NORMAL");
    const firstGpu = normalGpus[0];

    if (!firstGpu) {
      hasInitialized.current = true;
      return;
    }

    // 해당 GPU의 첫 번째 노드 찾기
    const matchedNode = gpuNodeData.content.find(
      (node) => node.gpuId === firstGpu.id,
    );

    // GPU 선택
    setSelectedGpu(firstGpu);

    // 노드 선택 및 리소스 초기화
    if (matchedNode) {
      selectNode(matchedNode);
      updateSingleNodeResource({
        gpu: matchedNode.gpuTotal,
        cpu: matchedNode.cpuTotal,
        memory: matchedNode.memoryTotal,
      });
    } else {
      updateSingleNodeResource(INITIAL_SINGLE_NODE_RESOURCE);
    }

    hasInitialized.current = true;
  }, [
    isDrawerOpen,
    gpuData,
    gpuNodeData,
    setSelectedGpu,
    selectNode,
    updateSingleNodeResource,
  ]);

  // GPU 타입별 필터링
  const gpusByType = {
    NORMAL: gpuData?.content.filter((gpu) => gpu.type === "NORMAL") ?? [],
    MIG: gpuData?.content.filter((gpu) => gpu.type === "MIG") ?? [],
    MPS: gpuData?.content.filter((gpu) => gpu.type === "MPS") ?? [],
  };

  // MIG/MPS GPU 존재 여부
  const hasMigOrMps = gpusByType.MIG.length > 0 || gpusByType.MPS.length > 0;

  // 현재 선택된 GPU 타입에 따른 GPU 목록
  const currentGpus = gpusByType[gpuType];

  // 선택된 GPU에 해당하는 노드 목록 (NORMAL, MPS용)
  const filteredNodes =
    gpuNodeData?.content.filter((node) => node.gpuId === selectedGpu?.id) ?? [];

  // MIG 프로필 목록
  const migProfiles = gpuProfileData?.content ?? [];

  // GPU 선택/해제 핸들러
  const handleClickGpu = (gpu: GpuListType) => {
    const isAlreadySelected = selectedGpu?.id === gpu.id;
    setSelectedGpu(isAlreadySelected ? null : gpu);
  };

  // 노드 선택 핸들러 (NORMAL, MPS용)
  const handleSelectNode = (value: string | number) => {
    const node = filteredNodes.find((n) => n.id === String(value));
    selectNode(node ?? null);
  };

  // MIG 프로필 선택 핸들러
  const handleSelectProfile = (value: GpuProfileListType["id"]) => {
    const profile = migProfiles.find((p) => p.id === value);
    selectProfile(profile ?? null);
  };

  // 특정 GPU 타입 옵션이 표시 가능한지 확인
  const isGpuTypeVisible = (type: ResourcePresetGpuType) => {
    if (type === "MIG") return gpusByType.MIG.length > 0;
    if (type === "MPS") return gpusByType.MPS.length > 0;
    return true;
  };

  // 비즈니스 룰 적용
  const isMultiNodeDisabled = !isMultiNodeEnabled(jobType);
  const shouldShowGpuNodeDropdown = showGpuNodeDropdown(nodeType);

  // MIG일 때는 프로필 드롭다운, 그 외에는 노드 드롭다운
  const isMigType = gpuType === "MIG";

  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>GPU 정보</CreateWorkloadSectionTitle>
      </FormSectionHeader>

      <Form layout="vertical">
        {/* 노드 타입 선택 */}
        <FormItem label="노드" required>
          <ButtonGrid $columns={2}>
            {NODE_TYPE_OPTIONS.map((option) => {
              const isSelected = nodeType === option.type;
              return (
                <SelectableBox
                  key={option.type}
                  icon={
                    <Icon
                      name={option.icon}
                      size={20}
                      color={isSelected ? "#154fed" : "#404040"}
                    />
                  }
                  title={option.label}
                  meta={<GuideTooltip title={option.tooltip} />}
                  isSelected={isSelected}
                  isDisabled={option.type === "multi" && isMultiNodeDisabled}
                  onClick={() => setNodeType(option.type)}
                />
              );
            })}
          </ButtonGrid>
        </FormItem>

        {/* GPU 형태 선택 - MIG/MPS가 있을 때만 노출 */}
        {hasMigOrMps && (
          <FormItem label="GPU 형태 선택" required>
            <ButtonGrid $columns={3}>
              {GPU_TYPE_OPTIONS.filter((option) =>
                isGpuTypeVisible(option.type),
              ).map((option) => (
                <SelectableBox
                  key={option.type}
                  title={option.label}
                  isSelected={gpuType === option.type}
                  onClick={() =>
                    setGpuType(option.type, gpuData?.content ?? [])
                  }
                />
              ))}
            </ButtonGrid>
          </FormItem>
        )}

        {/* GPU 선택 - 라벨이 gpuType에 따라 동적 변경, 드롭다운 포함 */}
        <FormItem
          label={getGpuSelectLabel(gpuType)}
          required
          validateStatus={
            errors.selectedGpu || errors.selectedNode || errors.selectedProfile
              ? "error"
              : undefined
          }
        >
          <GpuSelectContainer>
            {/* GPU 카드 목록 */}
            <ButtonGrid $columns={2}>
              {currentGpus.map((gpu) => (
                <SelectableBox
                  key={gpu.id}
                  title={gpu.name}
                  meta={
                    <SelectableBoxMeta
                      label="Memory"
                      value={gpu.memory}
                      unit={getResourceInfo("GPU_MEMORY").unit}
                    />
                  }
                  isSelected={selectedGpu?.id === gpu.id}
                  onClick={() => handleClickGpu(gpu)}
                  height="48px"
                  direction="column"
                />
              ))}
            </ButtonGrid>

            {/* MIG 프로필 드롭다운 - MIG 타입에서 GPU 선택 후 표시 */}
            {selectedGpu && isMigType && (
              <MigProfileSelectDropdown
                profiles={migProfiles}
                value={selectedProfile?.id ?? undefined}
                onChange={handleSelectProfile}
                error={Boolean(errors.selectedProfile)}
                loading={isLoadingProfiles}
              />
            )}

            {/* GPU 사용 노드 드롭다운 - Single Node + NORMAL/MPS에서만 표시 */}
            {selectedGpu && shouldShowGpuNodeDropdown && !isMigType && (
              <NodeSelectDropdown
                nodes={filteredNodes}
                value={selectedNode?.id ?? undefined}
                onChange={handleSelectNode}
                error={Boolean(errors.selectedNode)}
                loading={isLoadingNodes}
              />
            )}
          </GpuSelectContainer>
        </FormItem>
      </Form>
    </FormSectionContainer>
  );
}

/* =============================================================================
   스타일 컴포넌트
============================================================================= */

const ButtonGrid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 4px;
`;

const GpuSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
