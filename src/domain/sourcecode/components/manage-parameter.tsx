"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "xiilab-ui";

import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { CreateModelButton } from "@/shared/components/button/create-model-button";

interface ManageParameterProps {
  defaultParameters?: SourcecodeParameterType[];
}

/**
 * ManageParameter 컴포넌트
 *
 * 소스코드 생성 시 파라미터를 동적으로 추가/삭제할 수 있는 컴포넌트입니다.
 * 각 파라미터는 키와 값을 가지며, 컴포넌트 내부에서 상태를 관리합니다.
 * 최소 1개 이상의 파라미터를 유지합니다.
 *
 * @param parameters - 초기 파라미터 배열 (기본값으로 사용)
 * @returns 파라미터 관리 UI 컴포넌트
 */
export function ManageParameter({
  defaultParameters = [],
}: ManageParameterProps) {
  const [parameters, setParameters] = useState<SourcecodeParameterType[]>(
    defaultParameters.length > 0 ? defaultParameters : [{ key: "", value: "" }],
  );

  useEffect(() => {
    if (defaultParameters.length > 0) {
      setParameters(defaultParameters);
    }
  }, [defaultParameters]);

  const handleCreateParameter = () => {
    const newParameter: SourcecodeParameterType = { key: "", value: "" };
    setParameters((prev) => [...prev, newParameter]);
  };

  const handleDeleteParameter = (index: number) => {
    if (parameters.length > 1) {
      setParameters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleKeyChange = (index: number, key: string) => {
    setParameters((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], key };
      return newParameters;
    });
  };

  const handleValueChange = (index: number, value: string) => {
    setParameters((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], value };
      return newParameters;
    });
  };

  return (
    <Container>
      <AddButton>
        <CreateModelButton
          onClick={handleCreateParameter}
          title="파라미터 추가"
        />
      </AddButton>
      <Column>
        <Field>
          <HeaderTitle>키</HeaderTitle>
        </Field>
        <Field>
          <HeaderTitle>값</HeaderTitle>
        </Field>
        <Delete></Delete>
      </Column>
      {parameters.map((parameter, index) => (
        <Column key={parameter.key}>
          <Field>
            <Input
              placeholder="파라미터 키를 입력해주세요."
              width="100%"
              name={`parameter-key-${index}`}
              value={parameter.key}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              autoComplete="off"
            />
          </Field>
          <Field>
            <Input
              placeholder="파라미터 값을 입력해주세요."
              width="100%"
              name={`parameter-value-${index}`}
              value={parameter.value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              autoComplete="off"
            />
          </Field>
          <Delete>
            <Button
              icon="Close"
              iconSize={18}
              onClick={() => handleDeleteParameter(index)}
              disabled={parameters.length === 1}
            />
          </Delete>
        </Column>
      ))}
    </Container>
  );
}

const Container = styled.div`
  border-radius: 4px;
  border: 1px solid #c1c7ce;
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 6px;
  position: relative;
  width: 100%;
`;

const HeaderTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const Field = styled.div`
  flex: 1;
  overflow: hidden;
`;

const Delete = styled.div`
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: 6px;

  & > button {
    width: 30px !important;
    height: 30px !important;
  }
`;

const AddButton = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
`;
