"use client";

import { useAtomValue } from "jotai";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { Fragment } from "react";
import styled from "styled-components";
import { CompoundDropdown, Typography } from "xiilab-ui";

import {
  GpuResponseGpuType,
  type ResourcePresetSummaryResponse,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetAvailablePresets } from "@/api/generated/resource-preset/resource-preset";
import type {
  WorkloadJobType,
  WorkloadNodeMode,
} from "@/domain/workload/types/workload.type";
import { DROPDOWN_LIST_HEIGHT } from "@/shared/constants/core.constant";
import { useDebouncedSearch } from "@/shared/hooks/use-debounced-search";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";

interface ResourcePresetSelectProps {
  nodeMode: WorkloadNodeMode;
  workloadJobType: WorkloadJobType;
  preset: number | null;
  setPreset: Dispatch<SetStateAction<number | null>>;
  onSelectPreset?: (preset: ResourcePresetSummaryResponse | null) => void;
}

export function ResourcePresetSelect({
  nodeMode,
  workloadJobType,
  preset,
  setPreset,
  onSelectPreset,
}: ResourcePresetSelectProps) {
  const { keyword, handleSearch, resetKeyword } = useDebouncedSearch();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const {
    data: presets,
    isLoading,
    isError,
  } = useGetAvailablePresets({
    workspaceId: selectedWorkspace?.workspaceId,
    keyword: keyword || undefined,
    workloadJobType,
    nodeType: nodeMode,
  });

  const handlePresetChange = (value: string | number) => {
    const selectedId = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(selectedId)) {
      return;
    }
    const selectedPreset =
      presets?.find(
        (presetItem) => presetItem.resourcePresetId === selectedId,
      ) ?? null;
    setPreset(selectedId);
    onSelectPreset?.(selectedPreset);
    resetKeyword();
  };

  const renderResourceSpecItem = (label: string, value: string) => (
    <ResourceSpecItem>
      <Typography.Text variant="body-4-1" color="#22212A">
        {label}
      </Typography.Text>
      <Typography.Text variant="body-4-2" color="#22212A">
        {value}
      </Typography.Text>
    </ResourceSpecItem>
  );

  const renderSpecsWithDividers = (items: ReactNode[]) => (
    <ResourceSpecsContainer>
      {items.map((item, index) => (
        <Fragment key={`spec-${index}`}>
          {index > 0 && <ResourceSpecDivider />}
          {item}
        </Fragment>
      ))}
    </ResourceSpecsContainer>
  );

  const renderPresetOption = (presetItem: ResourcePresetSummaryResponse) => {
    const cpu = presetItem.resource.cpu.requestCore;
    const cpuInfo = getResourceInfo("CPU");
    const memInfo = getResourceInfo("MEM");
    const gpuInfo = getResourceInfo("GPU");
    const migInfo = getResourceInfo("MIG");

    const { value: memValue } = convertBytes(
      presetItem.resource.memory.requestByte,
      "GB",
      0,
    );
    const memLabel = formatNumberWithUnit(memValue, memInfo.unit);
    const gpu = presetItem.resource.gpu;
    const gpuType = gpu?.gpuType;
    const isSelected = preset === presetItem.resourcePresetId;

    const presetName = (
      <PresetNameText
        variant={isSelected ? "body-2-2" : "body-2-4"}
        color={isSelected ? "#382CE0" : "#000000"}
      >
        {presetItem.presetName}
      </PresetNameText>
    );

    const cpuSpec = renderResourceSpecItem(
      cpuInfo.text,
      formatNumberWithUnit(cpu, cpuInfo.unit),
    );
    const memSpec = renderResourceSpecItem(memInfo.text, memLabel);

    // MIG GPU 타입
    if (gpuType === GpuResponseGpuType.MIG) {
      const mig = gpu?.detail.mig || [];
      return (
        <ResourcePresetOptionContainer>
          {presetName}
          {renderSpecsWithDividers([
            ...mig.map((profile) => (
              <ResourceSpecItem key={profile.profile}>
                <Typography.Text variant="body-4-1" color="#22212A">
                  {migInfo.text} {profile.profile}
                </Typography.Text>
                <Typography.Text variant="body-4-2" color="#22212A">
                  {formatNumberWithUnit(profile.requestCount, migInfo.unit)}
                </Typography.Text>
              </ResourceSpecItem>
            )),
            cpuSpec,
            memSpec,
          ])}
        </ResourcePresetOptionContainer>
      );
    }

    // Normal GPU 또는 GPU 없음
    const normalGpuSpec =
      gpu && gpuType === GpuResponseGpuType.NORMAL
        ? renderResourceSpecItem(
            gpuInfo.text,
            formatNumberWithUnit(
              gpu.detail.normal?.requestCount || 0,
              gpuInfo.unit,
            ),
          )
        : null;

    return (
      <ResourcePresetOptionContainer>
        {presetName}
        {renderSpecsWithDividers([
          ...(normalGpuSpec ? [normalGpuSpec] : []),
          cpuSpec,
          memSpec,
        ])}
      </ResourcePresetOptionContainer>
    );
  };

  const presetOptionNodes =
    presets?.map((presetItem: ResourcePresetSummaryResponse) => (
      <CompoundDropdown.Option
        key={presetItem.resourcePresetId}
        value={presetItem.resourcePresetId}
        display={presetItem.presetName}
      >
        {renderPresetOption(presetItem)}
      </CompoundDropdown.Option>
    )) ?? [];

  return (
    <CompoundDropdown
      theme="light"
      width="100%"
      height={30}
      maxLength={DROPDOWN_LIST_HEIGHT}
      placeholder="리소스 프리셋을 선택 하세요"
      value={preset ?? undefined}
      onChange={handlePresetChange}
      showSearch
      filterOption={false}
      onSearch={handleSearch}
      loading={isLoading}
      status={isError ? "error" : undefined}
    >
      {presetOptionNodes}
    </CompoundDropdown>
  );
}

// CompoundDropdown 스타일드 컴포넌트들
const ResourcePresetOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 0;
`;

const PresetNameText = styled(Typography.Text)`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ResourceSpecsContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #fafafa;
  border: 1px solid #c1c7ce;
  border-radius: 2px;
  padding: 2px 6px;
  gap: 6px;
  margin-left: auto;
  height: 22px;
  flex-shrink: 0;
`;

const ResourceSpecItem = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
`;

const ResourceSpecDivider = styled.div`
  width: 1px;
  height: 8px;
  background-color: #e0e0e0;
`;
