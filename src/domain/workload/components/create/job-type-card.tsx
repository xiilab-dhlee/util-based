"use client";

import type { Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import { Box, Typography } from "xiilab-ui";

import { WORKLOAD_JOB_TYPES } from "@/domain/workload/constants/workload.constant";
import type { WorkloadJobType } from "@/domain/workload/types/workload.type";
import { getWorkloadJobTypeInfo } from "@/domain/workload/utils/workload.util";
import { JupyterIcon } from "@/shared/components/icon/jupyter-icon";
import { PytorchIcon } from "@/shared/components/icon/pytorch-icon";

const DESCRIPTION_MAP: Record<WorkloadJobType, string[]> = {
  BATCH: [
    "쿠버네티스에서 한 번 실행하고 종료되는 태스크를",
    "정의하는 워크로드 리소스로 주로 배치 작업,",
    "크론 작업 등에 사용합니다.",
  ],
  INTERACTIVE: [
    "로컬 / 클라우드 환경에서 쿠버네티스 클러스터를",
    "관리하고, 애플리케이션을 개발하고 테스트 가능한",
    "통합 환경을 제공하는 IDE를 사용할 수 있습니다.",
  ],
  DISTRIBUTED: [],
};

interface JobTypeCardProps {
  type: WorkloadJobType;
  value: WorkloadJobType;
  setValue: Dispatch<SetStateAction<WorkloadJobType>>;
}

export function JobTypeCard({ type, value, setValue }: JobTypeCardProps) {
  const { label } = getWorkloadJobTypeInfo(type);

  let icon = null;
  if (type === WORKLOAD_JOB_TYPES.INTERACTIVE) {
    icon = <JupyterIcon width={20} height={20} />;
  } else if (type === WORKLOAD_JOB_TYPES.BATCH) {
    icon = <PytorchIcon width={20} height={20} />;
  }

  const handleClick = () => {
    setValue(type);
  };

  return (
    <Box
      state={type === value ? "pressed" : "default"}
      onClick={handleClick}
      width="100%"
      height="100px"
      data-active={type === value}
    >
      <Container>
        <Header>
          <IconWrapper>{icon}</IconWrapper>
          <Typography.Text variant="subtitle-2-1">{label}</Typography.Text>
        </Header>
        <Typography.Text variant="body-3-3" color="var(--color-gray-04)">
          {DESCRIPTION_MAP[type].map((description) => (
            <span key={description}>
              {description}
              <br />
            </span>
          ))}
        </Typography.Text>
      </Container>
    </Box>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 16px;
  gap: 8px;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--color-white);
  border-radius: 50%;
  border: 1px solid var(--color-gray-08);
`;
