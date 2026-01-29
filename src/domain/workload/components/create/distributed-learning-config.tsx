"use client";

import { isNil, isString } from "es-toolkit";
import { useAtom } from "jotai";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { InputNumber, Typography } from "xiilab-ui";

import { DISTRIBUTED_TYPE_OPTIONS } from "@/domain/resource-preset/constants/resource-preset.constant";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import {
  distributedTypeAtom,
  workerCountAtom,
} from "@/domain/workload/state/create-workload.atom";
import { SelectableBox } from "@/shared/components/selectable-box";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import { errorTextStyle } from "@/styles/mixins/text";

export function DistributedLearningConfig() {
  const [, setDistributedType] = useAtom(distributedTypeAtom);
  const [workerCount, setWorkerCount] = useAtom(workerCountAtom);
  const { control } = useFormContext<CreateWorkloadFormValues>();
  const { field: distributedTypeField, fieldState: distributedTypeFieldState } =
    useController({
      name: "distributedType",
      control,
    });
  const { field: workerCountField, fieldState: workerCountFieldState } =
    useController({
      name: "workerCount",
      control,
    });

  const handleDistributedTypeSelect = (typeId: string) => {
    distributedTypeField.onChange(typeId);
    setDistributedType(typeId);
  };

  const handleWorkerCountChange = (value: string | number | null) => {
    if (isNil(value) || value === "") {
      workerCountField.onChange(undefined);
      setWorkerCount(null);
      return;
    }

    if (isString(value)) {
      const parsedValue = Number(value);
      const nextValue = Number.isNaN(parsedValue) ? null : parsedValue;
      workerCountField.onChange(nextValue ?? undefined);
      setWorkerCount(nextValue);
      return;
    }

    workerCountField.onChange(value);
    setWorkerCount(value);
  };

  const distributedTypeOptions = DISTRIBUTED_TYPE_OPTIONS.map((option) => (
    <DistributedTypeOption
      key={option.id}
      option={option}
      isSelected={distributedTypeField.value === option.id}
      onSelect={handleDistributedTypeSelect}
    />
  ));

  return (
    <>
      <DistributedSection>
        <DistributedSectionHeader>
          <CreateWorkloadSectionTitle className="required">
            분산 학습 설정
          </CreateWorkloadSectionTitle>
        </DistributedSectionHeader>

        {/* 분산 학습 타입 선택 */}
        <FormItem>
          <FormLabel>
            <LabelTextStrong>분산 학습 타입</LabelTextStrong>
          </FormLabel>
          <ButtonGrid>{distributedTypeOptions}</ButtonGrid>
          {distributedTypeFieldState.error?.message && (
            <ErrorMessage>
              {distributedTypeFieldState.error.message}
            </ErrorMessage>
          )}
        </FormItem>
        <FormItem>
          <FormLabel>
            <LabelTextStrong>분산 학습 구성</LabelTextStrong>
          </FormLabel>
          <InlineFormItem>
            <InlineFormLabel>
              <LabelText>Worker 수</LabelText>
            </InlineFormLabel>
            <InputNumber
              min={1}
              value={workerCountField.value ?? workerCount ?? undefined}
              onChange={handleWorkerCountChange}
              width={60}
              height={30}
              suffix="개"
            />
          </InlineFormItem>
          {workerCountFieldState.error?.message && (
            <ErrorMessage>{workerCountFieldState.error.message}</ErrorMessage>
          )}
        </FormItem>
      </DistributedSection>
      <SectionDivider />
    </>
  );
}

interface DistributedTypeOptionProps {
  option: (typeof DISTRIBUTED_TYPE_OPTIONS)[number];
  isSelected: boolean;
  onSelect: (typeId: string) => void;
}

function DistributedTypeOption({
  option,
  isSelected,
  onSelect,
}: DistributedTypeOptionProps) {
  const handleSelect = () => {
    onSelect(option.id);
  };

  return (
    <SelectableBox
      height="48px"
      direction="column"
      title={option.label}
      isSelected={isSelected}
      onClick={handleSelect}
      meta={<BoxDescription>{option.description}</BoxDescription>}
    />
  );
}

// 분산 학습 설정 섹션
const DistributedSection = styled.div`

`;

const DistributedSectionHeader = styled.div`
  margin-bottom: 16px;
`;

const FormItem = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.div`
  margin-bottom: 8px;
`;

const LabelTextStrong = styled(Typography.Text)`
  color: #484848;
  font-weight: 600;
  font-size: 12px;
`;

const LabelText = styled(Typography.Text)`
  color: #484848;
  font-weight: 500;
  font-size: 12px;
`;

const InlineFormItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const InlineFormLabel = styled(FormLabel)`
  margin-bottom: 0;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
`;

const BoxDescription = styled.div`
  font-weight: 400;
  font-size: 11px;
  color: #787878;
`;

const SectionDivider = styled.div`
  height: 1px;
  margin: 14px 0;
  background-color: #e0e0e0;
`;

const ErrorMessage = styled.div`
  ${errorTextStyle}
  margin-top: 6px;
`;
