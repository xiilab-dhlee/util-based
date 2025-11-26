"use client";

import { useAtom, useSetAtom } from "jotai";
import styled from "styled-components";
import { Switch, Typography } from "xiilab-ui";

import {
  gpuAtom,
  gpuEnabledAtom,
  gpuNodeAtom,
  gpuProfileAtom,
} from "@/domain/workload/state/create-workload.atom";
import { useGetGpus } from "@/shared/hooks/use-get-gpus";
import type { GpuListType } from "@/shared/schemas/gpu.schema";
import { CreateWorkloadGpuMig } from "./create-workload-gpu-mig";
import { CreateWorkloadGpuNormal } from "./create-workload-gpu-normal";

export function CreateWorkloadGpu() {
  const [gpuEnabled, setGpuEnabled] = useAtom(gpuEnabledAtom);
  const [gpu, setGpu] = useAtom(gpuAtom);
  const setGpuNode = useSetAtom(gpuNodeAtom);
  const setGpuProfile = useSetAtom(gpuProfileAtom);

  const { data } = useGetGpus();

  const normal = data?.content.filter((gpu) => gpu.type === "NORMAL") || [];
  const mig = data?.content.filter((gpu) => gpu.type === "MIG") || [];
  const mps = data?.content.filter((gpu) => gpu.type === "MPS") || [];

  const handleClickGpu = (_gpu: GpuListType) => {
    // 동일한 GPU 선택 시
    if (_gpu.id === gpu?.id) {
      setGpu(null);
    } else {
      setGpu(_gpu);
    }
    // 하위 선택 초기화
    setGpuNode(null);
    setGpuProfile(null);
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Typography.Text variant="subtitle-2-1">GPU 선택</Typography.Text>
          <Switch checked={gpuEnabled} onChange={setGpuEnabled} />
        </HeaderLeft>
      </Header>

      {/* GPU 활성화 시 상세 설정 표시 */}
      {gpuEnabled && (
        <Body>
          {/* GPU 섹션 */}
          <CreateWorkloadGpuNormal
            type="NORMAL"
            gpus={normal}
            isSelected={gpu?.type === "NORMAL"}
            onClickGpu={handleClickGpu}
          />
          {/* MIG 섹션 */}
          {mig.length > 0 && (
            <CreateWorkloadGpuMig
              gpus={mig}
              isSelected={gpu?.type === "MIG"}
              onClickGpu={handleClickGpu}
            />
          )}
          {mps.length > 0 && (
            <CreateWorkloadGpuNormal
              type="MPS"
              gpus={mps}
              isSelected={gpu?.type === "MPS"}
              onClickGpu={handleClickGpu}
            />
          )}
        </Body>
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

  &:last-child {
    margin-bottom: 0;
  }
`;

// GPU 토글 컨테이너
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

// GPU 관련 스타일드 컴포넌트들
const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;
