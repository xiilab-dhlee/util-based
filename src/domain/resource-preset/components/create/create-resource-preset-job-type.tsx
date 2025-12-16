"use client";

import type { ComponentType } from "react";
import styled from "styled-components";
import { Box, Form, FormItem } from "xiilab-ui";

import { useResourcePresetForm } from "@/domain/resource-preset/hooks/use-resource-preset-form";
import type { ResourcePresetJobType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { JupyterIcon } from "@/shared/components/icon/jupyter-icon";
import { PytorchIcon } from "@/shared/components/icon/pytorch-icon";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  FormSectionContainer,
  FormSectionHeader,
} from "@/styles/layers/form-layer.styled";

interface JobTypeOption {
  type: ResourcePresetJobType;
  label: string;
  icon: ComponentType<{ width: number; height: number }>;
  description: string[];
}

const JOB_TYPE_OPTIONS: JobTypeOption[] = [
  {
    type: "BATCH",
    label: "Batch Job",
    icon: PytorchIcon,
    description: [
      "쿠버네티스에서 한 번 실행하고 종료되는 태스크를",
      "정의하는 워크로드 리소스로 주로 배치 작업,",
      "크론 작업 등에 사용합니다.",
    ],
  },
  {
    type: "INTERACTIVE",
    label: "Interactive Job (IDE)",
    icon: JupyterIcon,
    description: [
      "로컬 / 클라우드 환경에서 쿠버네티스 클러스터를",
      "관리하고, 애플리케이션을 개발하고 테스트 가능한",
      "통합 환경을 제공하는 IDE를 사용할 수 있습니다.",
    ],
  },
];

export function CreateResourcePresetJobType() {
  const { form, setJobType } = useResourcePresetForm();
  return (
    <FormSectionContainer>
      <FormSectionHeader>
        <CreateWorkloadSectionTitle>Job Type</CreateWorkloadSectionTitle>
      </FormSectionHeader>
      <Form layout="vertical">
        <FormItem label="Job Type" required>
          <JobTypeBody>
            {JOB_TYPE_OPTIONS.map((option) => {
              const isSelected = option.type === form.jobType;
              const Icon = option.icon;
              return (
                <Box
                  key={option.type}
                  state={isSelected ? "pressed" : "default"}
                  onClick={() => setJobType(option.type)}
                  width="100%"
                  height="100px"
                >
                  <JobTypeContent>
                    <JobTypeHeader>
                      <IconWrapper>
                        <Icon width={20} height={20} />
                      </IconWrapper>
                      <JobTypeLabel>{option.label}</JobTypeLabel>
                    </JobTypeHeader>
                    <JobTypeDescription $isSelected={isSelected}>
                      {option.description.map((desc) => (
                        <span key={desc}>
                          {desc}
                          <br />
                        </span>
                      ))}
                    </JobTypeDescription>
                  </JobTypeContent>
                </Box>
              );
            })}
          </JobTypeBody>
        </FormItem>
      </Form>
    </FormSectionContainer>
  );
}

const JobTypeBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
`;

const JobTypeContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 16px;
  gap: 8px;
  height: 100%;
`;

const JobTypeHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

const JobTypeLabel = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #000;
`;

const JobTypeDescription = styled.div<{ $isSelected: boolean }>`
  font-size: 11px;
  line-height: 14px;
  color: ${({ $isSelected }) => ($isSelected ? "#00144B" : "#404040")};
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--color-white);
  border-radius: 50%;
  border: 1px solid #D5D4D8;
`;
