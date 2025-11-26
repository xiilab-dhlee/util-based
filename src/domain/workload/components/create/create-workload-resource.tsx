"use client";

import { useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";

import { nodeModeAtom } from "@/domain/workload/state/create-workload.atom";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { ResourcePresetSelect } from "./resource-preset-select";
import { SetMultinodeResource } from "./set-multinode-resource";
import { SetSinglenodeResource } from "./set-singlenode-resource";

export function CreateWorkloadResource() {
  const nodeMode = useAtomValue(nodeModeAtom);
  const [preset, setPreset] = useState<string>("custom");
  const nodeCount = 2;
  const cpuCoreMax = 200;
  const gpuCountMax = 5;
  const memoryGbMax = 170;
  const launcherCpuCoreMax = cpuCoreMax;
  const launcherMemoryGbMax = memoryGbMax;
  const workerCpuCoreMax = cpuCoreMax;
  const workerGpuCountMax = gpuCountMax;
  const workerMemoryGbMax = memoryGbMax;

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          리소스 프리셋
        </CreateWorkloadSectionTitle>
      </Header>
      <ResourcePresetDropdown>
        <ResourcePresetSelect
          nodeMode={nodeMode}
          preset={preset}
          setPreset={setPreset}
        />
      </ResourcePresetDropdown>

      {/* Custom 프리셋 선택 시 슬라이더 표시 */}
      {preset === "custom" &&
        (nodeMode === "multi" ? (
          <SetMultinodeResource
            nodeCount={nodeCount}
            launcherCpuCoreMax={launcherCpuCoreMax}
            launcherMemoryGbMax={launcherMemoryGbMax}
            workerCpuCoreMax={workerCpuCoreMax}
            workerGpuCountMax={workerGpuCountMax}
            workerMemoryGbMax={workerMemoryGbMax}
          />
        ) : (
          <SetSinglenodeResource
            cpuCoreMax={cpuCoreMax}
            gpuCountMax={gpuCountMax}
            memoryGbMax={memoryGbMax}
          />
        ))}
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
  margin-bottom: 12px;
`;

// 자원 프리셋 드롭다운
const ResourcePresetDropdown = styled.div`
  margin-bottom: 16px;
`;
