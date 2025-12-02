"use client";

import {
  // useAtom,
  useAtomValue,
} from "jotai";
import styled from "styled-components";

// import { Typography } from "xiilab-ui";

import {
  jobTypeAtom,
  // labelsAtom,
} from "@/domain/workload/state/create-workload.atom";
// import { MyMultipleSelect } from "@/shared/components/select/multiple";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { CreateWorkloadNodeButton } from "./create-workload-node-button";

export function CreateWorkloadNode() {
  // const [labels, setLabels] = useAtom(labelsAtom);
  const jobType = useAtomValue(jobTypeAtom);

  return (
    <Container>
      <Label>
        <CreateWorkloadSectionTitle className="required">
          노드
        </CreateWorkloadSectionTitle>
      </Label>
      <Buttons>
        <CreateWorkloadNodeButton type="single" />
        {/* 멀티 노드 버튼의 경우 인터랙티브 작업 타입일 때 비활성화 */}
        <CreateWorkloadNodeButton
          type="multi"
          disabled={jobType === "INTERACTIVE"}
        />
      </Buttons>
      {/* <Label>
        <CreateWorkloadSectionTitle>라벨</CreateWorkloadSectionTitle>
        <Typography.Text variant="body-4-1" color="#707070">
          (선택사항)
        </Typography.Text>
      </Label>
      <MyMultipleSelect
        options={[
          { label: "test", value: "test" },
          { label: "test2", value: "test2" },
          { label: "test3", value: "test3" },
        ]}
        value={labels}
        onChange={(value) => setLabels(value)}
      /> */}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

const Label = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 6px;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
  /* margin-bottom: 18px; */
`;
