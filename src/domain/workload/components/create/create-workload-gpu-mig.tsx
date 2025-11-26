"use client";

import classNames from "classnames";
import { useAtom, useAtomValue } from "jotai";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { useGetGpuProfiles } from "@/shared/hooks/use-get-gpu-profiles";
import type {
  GpuListType,
  GpuProfileListType,
} from "@/shared/schemas/gpu.schema";
import { gpuAtom, gpuProfileAtom } from "../../state/create-workload.atom";
import { GpuCard } from "./gpu-card";
import { GpuProfileCard } from "./gpu-profile-card";

interface CreateWorkloadGpuNormalProps {
  gpus: GpuListType[];
  isSelected: boolean;
  onClickGpu: (gpu: GpuListType) => void;
}

export function CreateWorkloadGpuMig({
  gpus,
  isSelected,
  onClickGpu,
}: CreateWorkloadGpuNormalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const gpu = useAtomValue(gpuAtom);
  const [gpuProfile, setGpuProfile] = useAtom(gpuProfileAtom);

  const { data } = useGetGpuProfiles();

  const handleClickGpuProfile = (profile: GpuProfileListType) => {
    setGpuProfile(profile);
  };

  return (
    <Container>
      <Header>
        <Title>MIG</Title>
        <Total>총 {gpus.length}개</Total>
      </Header>
      {/* GPU 목록 */}
      <GpuBody>
        {gpus.map((v) => (
          <GpuCard
            key={v.id}
            isSelected={gpu?.id === v.id}
            onClick={() => onClickGpu(v)}
            {...v}
          />
        ))}
      </GpuBody>
      {isSelected && (
        <GpuProfile>
          <GpuProfileHeader>
            <GpuProfileHeaderLeft>
              <Typography.Text variant="body-2-2" color="#484848">
                GPU
              </Typography.Text>
              <Divider />
              <Typography.Text variant="body-2-2" color="#484848">
                MIG 선택
              </Typography.Text>
            </GpuProfileHeaderLeft>
            <IconWrapper
              className={classNames({ active: isOpen })}
              onClick={() => setIsOpen(!isOpen)}
            >
              <Icon name="Dropdown" color="var(--icon-fill)" size={14} />
            </IconWrapper>
          </GpuProfileHeader>
          {/* GPU 노드 목록 */}
          <GpuProfileBody className={classNames({ active: isOpen })}>
            {data?.content.map((profile) => (
              <GpuProfileCard
                key={profile.id}
                isSelected={gpuProfile?.id === profile.id}
                onClick={handleClickGpuProfile}
                {...profile}
              />
            ))}
          </GpuProfileBody>
        </GpuProfile>
      )}
    </Container>
  );
}

const Title = styled(Typography.Text).attrs({
  variant: "body-2-2",
  color: "#000",
})`
`;

const Total = styled(Typography.Text).attrs({
  variant: "body-3-3",
  color: "#484848",
})`
  line-height: 16px;
`;

const GpuBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
`;

const GpuProfile = styled.div`
  background-color: #fafafa;
  border: 1px solid #d1d5dc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const GpuProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const GpuProfileHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
`;

const GpuProfileBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  width: 100%;
  max-height: 0;
  margin-top: 0;
  overflow: hidden;

  &.active {
    max-height: 100%;
    margin-top: 8px;
  }
`;

// GPU 섹션 컨테이너
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
  position: relative;
`;

const Divider = styled.div`
  width: 1px;
  height: 10px;
  background-color: #d2d4dc;
  margin: 0 4px;
`;

const IconWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;

  --icon-fill: #404040;

  &.active {
    transform: rotate(180deg);
  }
`;
