"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";

import { CreateWorkloadNodeButton } from "@/domain/workload/components/create/create-workload-node-button";
import { WORKLOAD_NODE_MODES } from "@/domain/workload/constants/workload.constant";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import {
  canUseMultiNodeAtom,
  distributedTypeAtom,
  isDistributedLearningAtom,
  nodeModeAtom,
  resourcePresetIdAtom,
  workerCountAtom,
} from "@/domain/workload/state/create-workload.atom";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

export function CreateWorkloadNode() {
  const canUseMultiNode = useAtomValue(canUseMultiNodeAtom);
  const isDistributedLearning = useAtomValue(isDistributedLearningAtom);
  const [, setNodeMode] = useAtom(nodeModeAtom);
  const [, setResourcePresetId] = useAtom(resourcePresetIdAtom);
  const [, setDistributedType] = useAtom(distributedTypeAtom);
  const [, setWorkerCount] = useAtom(workerCountAtom);
  const { control, setValue } = useFormContext<CreateWorkloadFormValues>();
  const { field: nodeTypeField } = useController({
    name: "nodeType",
    control,
  });

  const handleNodeTypeChange = (
    nextValue: CreateWorkloadFormValues["nodeType"],
  ) => {
    nodeTypeField.onChange(nextValue);
    setNodeMode(nextValue);
    setValue("resourcePresetId", null);
    setResourcePresetId(null);
  };

  useEffect(() => {
    if (isDistributedLearning) {
      return;
    }

    setValue("distributedType", null);
    setValue("workerCount", undefined);
    setDistributedType(null);
    setWorkerCount(null);
  }, [isDistributedLearning, setDistributedType, setValue, setWorkerCount]);

  return (
    <Container>
      <Label>
        <CreateWorkloadSectionTitle className="required">
          노드
        </CreateWorkloadSectionTitle>
      </Label>
      <Buttons>
        <CreateWorkloadNodeButton
          type={WORKLOAD_NODE_MODES.SINGLE}
          value={nodeTypeField.value}
          onChange={handleNodeTypeChange}
        />
        <CreateWorkloadNodeButton
          type={WORKLOAD_NODE_MODES.MULTI}
          disabled={!canUseMultiNode}
          value={nodeTypeField.value}
          onChange={handleNodeTypeChange}
        />
      </Buttons>
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
