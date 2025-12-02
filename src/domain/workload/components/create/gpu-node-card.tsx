"use client";

import styled from "styled-components";
import { Card, Typography } from "xiilab-ui";

import type { GpuNodeListType } from "@/shared/schemas/gpu.schema";

interface GpuCardProps extends GpuNodeListType {
  isSelected: boolean;
  onClick: (gpuNode: GpuNodeListType) => void;
}

export function GpuNodeCard({ isSelected, onClick, ...props }: GpuCardProps) {
  const {
    name,
    cpuUsed,
    cpuTotal,
    memoryUsed,
    memoryTotal,
    gpuUsed,
    gpuTotal,
  } = props;

  return (
    <Card
      title={name}
      checked={isSelected}
      width="100%"
      height={108}
      style={{ borderColor: isSelected ? "#366BFF" : "" }}
      onClick={() => onClick(props)}
    >
      <Container>
        <Bridge>
          <Left>
            <LeftBody>
              <CardStatsSection>
                <GPUNodeCardLabels>
                  <Typography.Text variant="body-4-1" color="#484848">
                    CPU
                  </Typography.Text>
                  <Typography.Text variant="body-4-1" color="#484848">
                    Memory
                  </Typography.Text>
                </GPUNodeCardLabels>
                <Divider />
                <GPUNodeCardValues>
                  <Typography.Text variant="body-4-2" color="#000000">
                    {cpuUsed} / {cpuTotal} Core
                  </Typography.Text>
                  <Typography.Text variant="body-4-2" color="#191B26">
                    {memoryUsed} / {memoryTotal} GB
                  </Typography.Text>
                </GPUNodeCardValues>
              </CardStatsSection>
              <CardSchedulingQueue>
                <Typography.Text variant="body-4-1" color="#484848">
                  Scheduling queue 0개
                </Typography.Text>
              </CardSchedulingQueue>
            </LeftBody>
          </Left>
          <Right>
            <AvailableBox>
              <Typography.Text variant="body-4-1" color="#191B26">
                사용가능 GPU
              </Typography.Text>
              <BoxDivider />
              <Typography.Text variant="body-2-1" color="#191B26">
                {gpuTotal}개
              </Typography.Text>
            </AvailableBox>
            <UsingBox>
              <Typography.Text variant="body-4-1" color="#191B26">
                사용중 GPU
              </Typography.Text>
              <BoxDivider />
              <Typography.Text variant="body-2-1" color="#191B26">
                {gpuUsed}개
              </Typography.Text>
            </UsingBox>
          </Right>
        </Bridge>
      </Container>
    </Card>
  );
}

const Left = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const LeftBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const CardStatsSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const CardSchedulingQueue = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
`;

const GPUNodeCardLabels = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 40px;
`;

const GPUNodeCardValues = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 70px;
  white-space: nowrap;
`;

const Divider = styled.div`
  width: 1px;
  height: 34px;
  background-color: #E9EBEE;
  margin: 0 2px;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  min-width: 100px;
  justify-content: flex-end;
`;

const AvailableBox = styled.div`
  background: #f5f9ff;
  border: 1px solid #8eb5ff;
  border-radius: 2px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  width: 46px;
  height: 60px;
  justify-content: center;
`;

const UsingBox = styled.div`
  background: #fcfaff;
  border: 1px solid #bb9cff;
  border-radius: 2px;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
  width: 46px;
  height: 60px;
  justify-content: center;
`;

const BoxDivider = styled.div`
  width: 30px;
  height: 1px;
  background-color: #DEE1E9;
  margin: 2px 0;
`;

// Card 내부 레이아웃을 위한 새 컴포넌트들
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 6px;
  padding: 0 4px;
  overflow: hidden;
`;

const Bridge = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: flex-start;
`;
