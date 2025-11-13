"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Input } from "xiilab-ui";

import { CreateModelButton } from "@/components/common/buttons/create-model-button";
import type { SourcecodeParameterType } from "@/schemas/sourcecode.schema";

/**
 * ManageParameter 컴포넌트의 Props 인터페이스
 */
interface ManageParameterProps {
  /** 소스코드 파라미터 배열 */
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
export function ManageParameter({ defaultParameters = [] }: ManageParameterProps) {
  /**
   * 파라미터 목록 상태
   * props로 전달된 parameters를 기본값으로 사용
   */
  const [parameters, setParameters] = useState<SourcecodeParameterType[]>(
    defaultParameters.length > 0 ? defaultParameters : [{ key: "", value: "" }],
  );

  /**
   * props로 전달된 parameters가 변경될 때 내부 상태 동기화
   */
  useEffect(() => {
    if (defaultParameters.length > 0) {
      setParameters(defaultParameters);
    }
  }, [defaultParameters]);

  /**
   * 새로운 파라미터 추가 핸들러
   * 기존 파라미터 목록에 빈 키와 값을 가진 새로운 파라미터를 추가합니다.
   */
  const handleCreateParameter = () => {
    const newParameter: SourcecodeParameterType = { key: "", value: "" };
    setParameters((prev) => [...prev, newParameter]);
  };

  /**
   * 파라미터 삭제 핸들러
   *
   * @param index 삭제할 파라미터의 인덱스
   * @description 최소 1개 이상의 파라미터를 유지하기 위해 파라미터가 1개일 때는 삭제하지 않습니다.
   */
  const handleDeleteParameter = (index: number) => {
    if (parameters.length > 1) {
      setParameters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  /**
   * 파라미터 키 변경 핸들러
   *
   * @param index 변경할 파라미터의 인덱스
   * @param key 새로운 키 값
   */
  const handleKeyChange = (index: number, key: string) => {
    setParameters((prev) => {
      const newParameters = [...prev];
      newParameters[index] = { ...newParameters[index], key };
      return newParameters;
    });
  };

  /**
   * 파라미터 값 변경 핸들러
   *
   * @param index 변경할 파라미터의 인덱스
   * @param value 새로운 값
   */
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
      {/* 컬럼 헤더 */}
      <Column>
        <Field>
          <HeaderTitle>키</HeaderTitle>
        </Field>
        <Field>
          <HeaderTitle>값</HeaderTitle>
        </Field>
        <Delete></Delete>
      </Column>
      {/* 파라미터 입력 필드들 */}
      {parameters.map((parameter, index) => (
        <Column key={index}>
          {/* 파라미터 키 입력 필드 */}
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
          {/* 파라미터 값 입력 필드 */}
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
          {/* 파라미터 삭제 버튼 */}
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


// ===== Styled Components =====

/**
 * 파라미터 입력 컨테이너
 * 테두리와 패딩을 가진 카드 형태의 레이아웃
 */
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

/**
 * 컬럼 헤더 제목 스타일
 * 파라미터 키/값 라벨의 스타일링
 */
const HeaderTitle = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 1;
`;

/**
 * 파라미터 행 레이아웃
 * 키, 값, 삭제 버튼을 가로로 배치
 */
const Column = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

/**
 * 입력 필드 컨테이너
 * flex: 1로 동일한 너비를 가지며 오버플로우를 처리
 */
const Field = styled.div`
  flex: 1;
  overflow: hidden;
`;

/**
 * 삭제 버튼 컨테이너
 * 오른쪽 정렬된 30px 너비의 삭제 버튼 영역
 */
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
/**
 * 파라미터 추가 버튼 컨테이너
 *
 */
const AddButton = styled.div`
  position: absolute;
  bottom: calc(100% + 6px);
  right: 0;
`;
