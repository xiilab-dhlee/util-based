"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { CreateWorkloadAutoSourcecode } from "@/domain/workload/components/create/create-workload-auto-sourcecode";
import { CreateWorkloadSourcecode } from "@/domain/workload/components/create/create-workload-sourcecode";
import { CreateWorkloadVolume } from "@/domain/workload/components/create/create-workload-volume";
import { WORKLOAD_IMAGE_TYPES } from "@/domain/workload/constants/workload.constant";
import { imageTypeAtom } from "@/domain/workload/state/create-workload.atom";

export function CreateWorkloadThirdStep() {
  const imageType = useAtomValue(imageTypeAtom);

  return (
    <Container>
      <Section>
        <Field>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">Input</Typography.Text>
            <Typography.Text variant="body-2-4" color="#707070">
              (선택사항)
            </Typography.Text>
          </FieldHeader>
        </Field>
        <FieldBody>
          {/* 소스코드 추가 영역 */}
          {imageType === WORKLOAD_IMAGE_TYPES.HUB && (
            <CreateWorkloadAutoSourcecode />
          )}
          {imageType !== WORKLOAD_IMAGE_TYPES.HUB && (
            <CreateWorkloadSourcecode />
          )}
          {/* 볼륨 추가 영역 */}
          <CreateWorkloadVolume />
        </FieldBody>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Section = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const FieldBody = styled.div`
  display: flex;
  flex-direction: column;

  & > div + div { 
    border-top: 1px solid #E0E0E0;
    margin-top: 20px;
    padding-top: 20px;
  }
`;
