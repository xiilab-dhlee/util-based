"use client";

import styled from "styled-components";

import { MyIcon } from "@/components/common/icon";

export function EmptyVolumeWorkload() {
  return (
    <Container>
      <IconWrapper>
        <MyIcon name="PriorityHigh" color="var(--icon-fill)" />
      </IconWrapper>
      <Body>
        <WorkloadEmptyTitle>
          현재 사용중인 워크로드가 없습니다.
        </WorkloadEmptyTitle>
        <WorkloadEmptyDescription>
          해당 볼륨을 사용한 워크로드 목록이 존재하지 않습니다.
        </WorkloadEmptyDescription>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  grid-column: 1 / -1;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border-radius: 50%;
  background-color: #f0f0f2;
  width: 50px;
  height: 50px;

  --icon-fill: #878898;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WorkloadEmptyTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 12px;
  text-align: center;
`;

const WorkloadEmptyDescription = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
`;
