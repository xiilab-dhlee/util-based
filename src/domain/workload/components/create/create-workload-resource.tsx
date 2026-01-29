"use client";

import { useAtom, useAtomValue } from "jotai";
import type { SetStateAction } from "react";
import { useEffect, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";

import type { ResourcePresetSummaryResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetAvailablePresets } from "@/api/generated/resource-preset/resource-preset";
import { DistributedLearningConfig } from "@/domain/workload/components/create/distributed-learning-config";
import { ResourcePresetDetailSummary } from "@/domain/workload/components/create/resource-preset-detail-summary";
import { ResourcePresetSelect } from "@/domain/workload/components/create/resource-preset-select";
import { WORKLOAD_JOB_TYPES } from "@/domain/workload/constants/workload.constant";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import {
  isDistributedLearningAtom,
  jobTypeAtom,
  nodeModeAtom,
  resourcePresetIdAtom,
} from "@/domain/workload/state/create-workload.atom";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { errorTextStyle } from "@/styles/mixins/text";

export function CreateWorkloadResource() {
  const nodeMode = useAtomValue(nodeModeAtom);
  const jobType = useAtomValue(jobTypeAtom);
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const isDistributedLearning = useAtomValue(isDistributedLearningAtom);
  const [preset, setPreset] = useAtom(resourcePresetIdAtom);
  const [selectedPreset, setSelectedPreset] =
    useState<ResourcePresetSummaryResponse | null>(null);
  const { control } = useFormContext<CreateWorkloadFormValues>();
  const {
    field: resourcePresetIdField,
    fieldState: resourcePresetIdFieldState,
  } = useController({
    name: "resourcePresetId",
    control,
  });

  const workloadJobType = isDistributedLearning
    ? WORKLOAD_JOB_TYPES.DISTRIBUTED
    : jobType;
  const { data: presets } = useGetAvailablePresets({
    workspaceId: selectedWorkspace?.workspaceId,
    workloadJobType,
    nodeType: nodeMode,
  });

  useEffect(() => {
    if (preset && presets) {
      const foundPreset = presets.find((p) => p.resourcePresetId === preset);
      setSelectedPreset(foundPreset ?? null);
    } else if (!preset) {
      setSelectedPreset(null);
    }
  }, [preset, presets]);

  const handleSelectPreset = (
    presetItem: ResourcePresetSummaryResponse | null,
  ) => {
    setSelectedPreset(presetItem);
  };

  const handlePresetChange = (nextPreset: SetStateAction<number | null>) => {
    const resolvedPreset =
      typeof nextPreset === "function" ? nextPreset(preset) : nextPreset;
    resourcePresetIdField.onChange(resolvedPreset);
    setPreset(resolvedPreset);
  };

  return (
    <Container>
      {isDistributedLearning && <DistributedLearningConfig />}

      <Header>
        <CreateWorkloadSectionTitle className="required">
          리소스 프리셋
        </CreateWorkloadSectionTitle>
      </Header>
      <ResourcePresetDropdown>
        <ResourcePresetSelect
          nodeMode={nodeMode}
          workloadJobType={workloadJobType}
          preset={preset}
          setPreset={handlePresetChange}
          onSelectPreset={handleSelectPreset}
        />
      </ResourcePresetDropdown>
      {resourcePresetIdFieldState.error?.message && (
        <ErrorMessage>{resourcePresetIdFieldState.error.message}</ErrorMessage>
      )}
      {selectedPreset && (
        <PresetDetailSection>
          <ResourcePresetDetailSummary preset={selectedPreset} />
        </PresetDetailSection>
      )}
    </Container>
  );
}

// 메인 컨테이너들
const Container = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 8px;
`;

// 리소스 프리셋 드롭다운
const ResourcePresetDropdown = styled.div`
  /* margin-bottom: 16px; */
`;

const PresetDetailSection = styled.div`
  margin-top: 12px;
`;

const ErrorMessage = styled.div`
  ${errorTextStyle}
  margin-top: 6px;
`;
