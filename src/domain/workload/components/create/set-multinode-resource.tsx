"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  launcherCpuCoreAtom,
  launcherMemoryGbAtom,
  workerCpuCoreAtom,
  workerGpuCountAtom,
  workerMemoryGbAtom,
} from "@/domain/workload/state/create-workload.atom";
import { ResourceSlider } from "@/shared/components/slider/resource-slider";
import { ResourceUsageBar } from "./resource-usage-bar";

interface SetMultinodeResourceProps {
  nodeCount: number;
  launcherCpuCoreMax: number;
  launcherMemoryGbMax: number;
  workerCpuCoreMax: number;
  workerGpuCountMax: number;
  workerMemoryGbMax: number;
}

export function SetMultinodeResource({
  nodeCount,
  launcherCpuCoreMax,
  launcherMemoryGbMax,
  workerCpuCoreMax,
  workerGpuCountMax,
  workerMemoryGbMax,
}: SetMultinodeResourceProps) {
  const [launcherCpuCore, setLauncherCpuCore] = useAtom(launcherCpuCoreAtom);
  const [launcherMemoryGb, setLauncherMemoryGb] = useAtom(launcherMemoryGbAtom);
  const [workerCpuCore, setWorkerCpuCore] = useAtom(workerCpuCoreAtom);
  const [workerGpuCount, setWorkerGpuCount] = useAtom(workerGpuCountAtom);
  const [workerMemoryGb, setWorkerMemoryGb] = useAtom(workerMemoryGbAtom);

  return (
    <>
      <DistributedLearningContainer>
        {/* Launcher 섹션 */}
        <ResourceSectionTitle>
          <Typography.Text variant="subtitle-2-1" color="#484848">
            Launcher
          </Typography.Text>
        </ResourceSectionTitle>

        <ResourceSliderRow>
          <ResourceLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              CPU
            </Typography.Text>
          </ResourceLabel>
          <SliderWrapper>
            <ResourceSlider
              min={1}
              max={launcherCpuCoreMax}
              value={launcherCpuCore}
              setValue={setLauncherCpuCore}
              resourceColor="#376DFF"
            />
          </SliderWrapper>
        </ResourceSliderRow>

        <ResourceSliderRow>
          <ResourceLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              Memory
            </Typography.Text>
          </ResourceLabel>
          <SliderWrapper>
            <ResourceSlider
              min={1}
              max={launcherMemoryGbMax}
              value={launcherMemoryGb}
              setValue={setLauncherMemoryGb}
              resourceColor="#55D398"
            />
          </SliderWrapper>
        </ResourceSliderRow>

        <ResourceDivider />

        {/* 분산 학습 구성 */}
        <DistributedLearningRow>
          <Typography.Text variant="subtitle-2-1" color="#484848">
            분산 학습 구성
          </Typography.Text>
          <WorkerCountDisplay>
            <Typography.Text variant="body-2-3" color="#484848">
              Worker 개수
            </Typography.Text>
            <Typography.Text variant="body-3-2" color="#000000">
              {nodeCount}
            </Typography.Text>
            <Typography.Text variant="body-3-3" color="#484848">
              개
            </Typography.Text>
          </WorkerCountDisplay>
        </DistributedLearningRow>

        <ResourceDivider />

        {/* Worker 섹션 */}
        <ResourceSectionTitle>
          <Typography.Text variant="subtitle-2-1" color="#484848">
            Worker
          </Typography.Text>
        </ResourceSectionTitle>

        <ResourceSliderRow>
          <ResourceLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              GPU
            </Typography.Text>
          </ResourceLabel>
          <SliderWrapper>
            <ResourceSlider
              min={1}
              max={workerGpuCountMax}
              value={workerGpuCount}
              setValue={setWorkerGpuCount}
              resourceColor="#A353FF"
            />
          </SliderWrapper>
        </ResourceSliderRow>

        <ResourceSliderRow>
          <ResourceLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              CPU
            </Typography.Text>
          </ResourceLabel>
          <SliderWrapper>
            <ResourceSlider
              min={1}
              max={workerCpuCoreMax}
              value={workerCpuCore}
              setValue={setWorkerCpuCore}
              resourceColor="#376DFF"
            />
          </SliderWrapper>
        </ResourceSliderRow>

        <ResourceSliderRow>
          <ResourceLabel>
            <Typography.Text variant="body-2-3" color="#484848">
              Memory
            </Typography.Text>
          </ResourceLabel>
          <SliderWrapper>
            <ResourceSlider
              min={1}
              max={workerMemoryGbMax}
              value={workerMemoryGb}
              setValue={setWorkerMemoryGb}
              resourceColor="#55D398"
            />
          </SliderWrapper>
        </ResourceSliderRow>
      </DistributedLearningContainer>

      {/* 리소스 사용량 카드 */}
      <ResourceUsageCard>
        <ResourceUsageHeader>
          <Typography.Text variant="subtitle-2-1" color="#484848">
            리소스 사용량
          </Typography.Text>
          <ResourceUsageLegend>
            <LegendItem>
              <LegendDot $color="#757380" />
              <Typography.Text variant="body-3-3" color="#484848">
                사용량
              </Typography.Text>
            </LegendItem>
            <LegendItem>
              <LegendDotGroup>
                <LegendDot $color="#A353FF" />
                <LegendDot $color="#376DFF" />
                <LegendDot $color="#55D398" />
              </LegendDotGroup>
              <Typography.Text variant="body-3-3" color="#484848">
                요청량
              </Typography.Text>
            </LegendItem>
          </ResourceUsageLegend>
        </ResourceUsageHeader>

        <UsageSliderGrid>
          <ResourceUsageBar
            type="GPU"
            currentValue={workerGpuCount * nodeCount}
            maxValue={workerGpuCountMax}
            usedPercentage={100}
            isOverLimit={workerGpuCount * nodeCount > 5}
          />
          <ResourceUsageBar
            type="CPU"
            currentValue={launcherCpuCore + workerCpuCore * nodeCount}
            maxValue={200}
            usedPercentage={70}
            isOverLimit={launcherCpuCore + workerCpuCore * nodeCount > 200}
          />
          <ResourceUsageBar
            type="MEM"
            currentValue={launcherMemoryGb + workerMemoryGb * nodeCount}
            maxValue={170}
            usedPercentage={65}
            isOverLimit={launcherMemoryGb + workerMemoryGb * nodeCount > 170}
          />
        </UsageSliderGrid>
      </ResourceUsageCard>
    </>
  );
}

// 슬라이더 래퍼
const SliderWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

// Multi Node - 분산 학습 구성 스타일
const DistributedLearningContainer = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const DistributedLearningRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
`;

const WorkerCountDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ResourceDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  margin: 10px 0;
`;

const ResourceSectionTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const ResourceSliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const ResourceLabel = styled.div`
  width: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const ResourceUsageCard = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 12px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResourceUsageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UsageSliderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const ResourceUsageLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LegendDot = styled.div<{ $color: string }>`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
`;

const LegendDotGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;
