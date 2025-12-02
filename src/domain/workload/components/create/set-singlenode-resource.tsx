"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  cpuCoreAtom,
  gpuCountAtom,
  memoryGbAtom,
} from "@/domain/workload/state/create-workload.atom";
import { ResourceSlider } from "@/shared/components/slider/resource-slider";

interface SetSinglenodeResourceProps {
  cpuCoreMax: number;
  gpuCountMax: number;
  memoryGbMax: number;
}

export function SetSinglenodeResource({
  gpuCountMax,
  cpuCoreMax,
  memoryGbMax,
}: SetSinglenodeResourceProps) {
  const [gpuCount, setGpuCount] = useAtom(gpuCountAtom);
  const [cpuCore, setCpuCore] = useAtom(cpuCoreAtom);
  const [memoryGb, setMemoryGb] = useAtom(memoryGbAtom);

  return (
    <Container>
      <SliderRow>
        <SliderLabel>
          <Typography.Text variant="body-3-1" color="#484848">
            GPU
          </Typography.Text>
        </SliderLabel>
        <SliderWrapper>
          <ResourceSlider
            min={1}
            max={gpuCountMax}
            value={gpuCount}
            setValue={setGpuCount}
            resourceColor="#A353FF"
            unit="개"
          />
        </SliderWrapper>
      </SliderRow>
      {/* CPU 슬라이더 */}
      <SliderRow>
        <SliderLabel>
          <Typography.Text variant="body-3-1" color="#484848">
            CPU
          </Typography.Text>
        </SliderLabel>
        <SliderWrapper>
          <ResourceSlider
            min={1}
            max={cpuCoreMax}
            value={cpuCore}
            setValue={setCpuCore}
            resourceColor="#376DFF"
            unit="Core"
          />
        </SliderWrapper>
      </SliderRow>

      {/* Memory 슬라이더 */}
      <SliderRow>
        <SliderLabel>
          <Typography.Text variant="body-3-1" color="#484848">
            Memory
          </Typography.Text>
        </SliderLabel>
        <SliderWrapper>
          <ResourceSlider
            min={1}
            max={memoryGbMax}
            value={memoryGb}
            setValue={setMemoryGb}
            resourceColor="#55D398"
            unit="GB"
          />
        </SliderWrapper>
      </SliderRow>
    </Container>
  );
}

const Container = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 슬라이더와 라벨을 포함하는 컨테이너
const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 30px;
`;

// 슬라이더 라벨
const SliderLabel = styled.div`
  width: 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

// 슬라이더 래퍼
const SliderWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
