"use client";

import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import { Input, Typography } from "xiilab-ui";

import {
  imageTypeAtom,
  workloadOutputPathAtom,
} from "../../state/create-workload.atom";
import { CreateWorkloadAutoSourcecode } from "./create-workload-auto-sourcecode";
import { CreateWorkloadSourcecode } from "./create-workload-sourcecode";
import { CreateWorkloadVolume } from "./create-workload-volume";

export function CreateWorkloadThirdStep() {
  const imageType = useAtomValue(imageTypeAtom);
  const [outputPath, setOutputPath] = useAtom(workloadOutputPathAtom);

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
        {/* 소스코드 추가 영역 */}
        {imageType === "HUB" && <CreateWorkloadAutoSourcecode />}
        {imageType !== "HUB" && <CreateWorkloadSourcecode />}
        {/* 볼륨 추가 영역 */}
        <CreateWorkloadVolume />
      </Section>
      <Section>
        <FieldHeader>
          <Typography.Text variant="subtitle-2-1">Output 경로</Typography.Text>
          <Typography.Text variant="body-2-4" color="#707070">
            (선택사항)
          </Typography.Text>
        </FieldHeader>
        <Input
          placeholder="Output 경로를 입력해주세요."
          value={outputPath || ""}
          onChange={(e) => setOutputPath(e.target.value)}
        />
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
