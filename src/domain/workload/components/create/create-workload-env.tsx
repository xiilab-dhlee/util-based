"use client";

import { useAtom } from "jotai";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { Button, Icon, Input, Typography } from "xiilab-ui";
import type { ZodIssue } from "zod";

import { createWorkloadBody } from "@/api/generated/workload/workload.zod";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import { envsAtom } from "@/domain/workload/state/create-workload.atom";

const envItemSchema = createWorkloadBody.shape.env.unwrap().element;

const getEnvIssueMessage = (issue: ZodIssue): string => {
  const field = issue.path[0];

  if (issue.code === "invalid_string" && field === "key") {
    return "환경변수 키 형식이 올바르지 않습니다.";
  }

  if (issue.code === "too_small") {
    if (field === "key") return "환경변수 키를 입력해 주세요.";
    if (field === "value") return "환경변수 값을 입력해 주세요.";
  }

  if (issue.code === "too_big") {
    if (field === "key") return "환경변수 키 길이가 너무 깁니다.";
    if (field === "value") return "환경변수 값 길이가 너무 깁니다.";
  }

  if (issue.code === "invalid_type") {
    if (field === "key") return "환경변수 키를 입력해 주세요.";
    if (field === "value") return "환경변수 값을 입력해 주세요.";
  }

  return "입력값을 확인해 주세요.";
};

const hasDuplicateKey = (
  envs: NonNullable<CreateWorkloadFormValues["env"]>,
  key: string,
  ignoreIndex?: number,
): boolean => {
  if (key.trim().length === 0) return false;
  return envs.some(
    (env, index) =>
      env.key === key && (ignoreIndex === undefined || index !== ignoreIndex),
  );
};

export function CreateWorkloadEnv() {
  const [envs, setEnvs] = useAtom(envsAtom);
  const { control, trigger } = useFormContext<CreateWorkloadFormValues>();
  const { field: envsField, fieldState: envsFieldState } = useController({
    name: "env",
    control,
  });
  const [tempKey, setTempKey] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const updateEnvs = (nextEnvs: typeof envs) => {
    envsField.onChange(nextEnvs);
    setEnvs(nextEnvs);
    void trigger("env");
  };

  const handleCreate = () => {
    const nextEnv = {
      key: tempKey.trim(),
      value: tempValue.trim(),
    };

    const validationResult = envItemSchema.safeParse(nextEnv);
    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      setInputError(
        issue ? getEnvIssueMessage(issue) : "입력값을 확인해 주세요.",
      );
      return;
    }

    if (hasDuplicateKey(envs, nextEnv.key)) {
      setInputError("이미 존재하는 키입니다.");
      return;
    }

    updateEnvs([...envs, nextEnv]);
    setTempKey("");
    setTempValue("");
    setInputError(null);
  };

  const handleDelete = (index: number) => {
    updateEnvs(envs.filter((_, i) => i !== index));
  };

  const handleChangeEnvKey = (index: number, value: string) => {
    updateEnvs(
      envs.map((variable, i) =>
        i === index ? { ...variable, key: value } : variable,
      ),
    );
  };

  const handleChangeEnvValue = (index: number, value: string) => {
    updateEnvs(
      envs.map((variable, i) =>
        i === index ? { ...variable, value } : variable,
      ),
    );
  };

  const handleTempKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempKey(event.target.value);
    setInputError(null);
  };

  const handleTempValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempValue(event.target.value);
    setInputError(null);
  };

  const hasError = Boolean(inputError || envsFieldState.error?.message);

  return (
    <Container>
      <InputSection>
        <InputWrapper>
          <Input
            placeholder="환경변수 키 입력"
            value={tempKey}
            onChange={handleTempKeyChange}
            width="100%"
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            placeholder="환경변수 값 입력"
            value={tempValue}
            onChange={handleTempValueChange}
            width="100%"
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <Button
          icon="Plus"
          iconSize={20}
          onClick={handleCreate}
          width={30}
          height={30}
        />
      </InputSection>
      {(inputError || envsFieldState.error?.message) && (
        <ErrorMessage>
          {inputError || envsFieldState.error?.message}
        </ErrorMessage>
      )}
      {envs.length === 0 ? (
        <EmptyState>
          <EmptyIconCircle>
            <Icon name="Info" size={24} color="#FFFFFF" />
          </EmptyIconCircle>
          <EmptyText>
            <EmptyTitle>환경변수가 입력되지 않았습니다.</EmptyTitle>
            <EmptyDescription>
              키와 값을 입력 후 추가해 주세요.
            </EmptyDescription>
          </EmptyText>
        </EmptyState>
      ) : (
        <EnvList>
          <ListHeader>
            <HeaderCell>키</HeaderCell>
            <HeaderCell>값</HeaderCell>
            <DeletePlaceholder />
          </ListHeader>
          {envs.map((env, index) => (
            <EnvRow
              key={`${env.key}-${index}`}
              env={env}
              index={index}
              isDuplicateKey={hasDuplicateKey(envs, env.key, index)}
              onDelete={handleDelete}
              onChangeKey={handleChangeEnvKey}
              onChangeValue={handleChangeEnvValue}
            />
          ))}
        </EnvList>
      )}
    </Container>
  );
}

interface EnvRowProps {
  env: NonNullable<CreateWorkloadFormValues["env"]>[number];
  index: number;
  isDuplicateKey: boolean;
  onDelete: (index: number) => void;
  onChangeKey: (index: number, value: string) => void;
  onChangeValue: (index: number, value: string) => void;
}

function EnvRow({
  env,
  index,
  isDuplicateKey,
  onDelete,
  onChangeKey,
  onChangeValue,
}: EnvRowProps) {
  const handleDeleteClick = () => {
    onDelete(index);
  };

  const handleKeyChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeKey(index, e.target.value);
  };

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeValue(index, e.target.value);
  };

  return (
    <Row>
      <FieldCell>
        <Input
          value={env.key}
          onChange={handleKeyChange}
          width="100%"
          status={isDuplicateKey ? "error" : undefined}
          disabled
        />
      </FieldCell>
      <FieldCell>
        <Input
          value={env.value}
          onChange={handleValueChange}
          width="100%"
          disabled
        />
      </FieldCell>
      <Delete>
        <Button icon="Close" iconSize={18} onClick={handleDeleteClick} />
      </Delete>
    </Row>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
`;

const InputSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputWrapper = styled.div`
  flex: 1;
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #ff4d4f;
  line-height: 1.4;
`;

const EnvList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 8px;
  border-top: 1px solid #e9e9e9;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderCell = styled.div`
  flex: 1;
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
  color: #666666;
`;

const DeletePlaceholder = styled.div`
  width: 30px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FieldCell = styled.div`
  flex: 1;
`;

const Delete = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > button {
    width: 30px !important;
    height: 30px !important;
  }
`;

const EmptyState = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  padding: 16px 0;
`;

const EmptyIconCircle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #878898;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const EmptyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
  height: 36px;
`;

const EmptyTitle = styled(Typography.Text).attrs({
  variant: "body-2-2",
  color: "#333333",
})``;

const EmptyDescription = styled(Typography.Text).attrs({
  variant: "body-2-4",
  color: "#666666",
})``;
