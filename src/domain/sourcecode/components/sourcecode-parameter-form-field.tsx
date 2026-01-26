"use client";

import styled from "styled-components";
import { Button, Icon, Input, Typography } from "xiilab-ui";

import { useSourcecodeParameterForm } from "@/domain/sourcecode/hooks/use-sourcecode-parameter-form";
import type { SourcecodeParameterType } from "@/domain/sourcecode/schemas/sourcecode.schema";

// ===== 타입 =====

export interface SourcecodeParameterFormFieldProps {
  /** 파라미터 목록 (controlled) */
  value: SourcecodeParameterType[];

  /** 전체 필드 에러 */
  error?: string;

  /** 추가 콜백 */
  onAdd: (parameter: SourcecodeParameterType) => void;

  /** 수정 콜백 */
  onUpdate: (index: number, parameter: SourcecodeParameterType) => void;

  /** 삭제 콜백 */
  onRemove: (index: number) => void;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 클래스명 */
  className?: string;
}

// ===== 헬퍼 함수 =====

/**
 * 중복 키가 있는지 확인
 * @param parameters - 파라미터 목록
 * @param key - 확인할 키
 * @param ignoreIndex - 무시할 인덱스 (수정 시)
 */
const hasDuplicateKey = (
  parameters: SourcecodeParameterType[],
  key: string,
  ignoreIndex?: number,
): boolean => {
  return parameters.some(
    (param, index) =>
      param.key === key && (ignoreIndex === undefined || index !== ignoreIndex),
  );
};

// ===== 컴포넌트 =====

/**
 * 소스코드 파라미터 폼 필드
 *
 * 소스코드 파라미터(키-값 쌍)를 추가/수정/삭제할 수 있는 재사용 가능한 폼 컴포넌트입니다.
 * 중복된 키를 허용하지 않습니다.
 */
export function SourcecodeParameterFormField({
  value,
  error,
  onAdd,
  onUpdate,
  onRemove,
  disabled = false,
  className,
}: SourcecodeParameterFormFieldProps) {
  const {
    tempKey,
    tempValue,
    inputError,
    setTempKey,
    setTempValue,
    validateAndGetParameter,
    resetForm,
  } = useSourcecodeParameterForm();

  /**
   * 파라미터 추가 핸들러
   */
  const handleAdd = () => {
    const existingKeys = value.map((param) => param.key);
    const validParameter = validateAndGetParameter(existingKeys);
    if (validParameter) {
      onAdd(validParameter);
      resetForm();
    }
  };

  /**
   * 파라미터 키 수정 핸들러
   */
  const handleKeyChange = (index: number, newKey: string) => {
    const currentParam = value[index];
    onUpdate(index, { ...currentParam, key: newKey });
  };

  /**
   * 파라미터 값 수정 핸들러
   */
  const handleValueChange = (index: number, newValue: string) => {
    const currentParam = value[index];
    onUpdate(index, { ...currentParam, value: newValue });
  };

  /**
   * 키 중복 검사 (수정 시)
   */
  const isKeyDuplicate = (key: string, currentIndex: number): boolean => {
    return hasDuplicateKey(value, key, currentIndex);
  };

  const hasError = Boolean(inputError || error);

  return (
    <Container className={className}>
      {/* 입력 섹션 */}
      <InputSection>
        <InputWrapper>
          <Input
            placeholder="파라미터 키 입력"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            width="100%"
            disabled={disabled}
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            placeholder="파라미터 값 입력"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            width="100%"
            disabled={disabled}
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <Button
          icon="Plus"
          iconSize={20}
          onClick={handleAdd}
          disabled={disabled}
          width={30}
          height={30}
        />
      </InputSection>

      {/* 에러 메시지 */}
      {(inputError || error) && (
        <ErrorMessage>{inputError || error}</ErrorMessage>
      )}

      {/* 파라미터 목록 */}
      {value.length === 0 ? (
        <EmptyState>
          <EmptyIconCircle>
            <Icon name="Info" size={24} color="#FFFFFF" />
          </EmptyIconCircle>
          <EmptyText>
            <EmptyTitle>파라미터가 입력되지 않았습니다.</EmptyTitle>
            <EmptyDescription>
              키와 값을 입력 후 추가해 주세요.
            </EmptyDescription>
          </EmptyText>
        </EmptyState>
      ) : (
        <ParameterList>
          {/* 헤더 */}
          <ListHeader>
            <HeaderCell>키</HeaderCell>
            <HeaderCell>값</HeaderCell>
            <DeletePlaceholder />
          </ListHeader>

          {/* 파라미터 행 */}
          {value.map((param, index) => {
            const isDuplicate = isKeyDuplicate(param.key, index);
            return (
              <ParameterRow key={`param-${index}`}>
                <FieldCell>
                  <Input
                    value={param.key}
                    onChange={(e) => handleKeyChange(index, e.target.value)}
                    width="100%"
                    disabled={disabled}
                    status={isDuplicate ? "error" : undefined}
                  />
                </FieldCell>
                <FieldCell>
                  <Input
                    value={param.value}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    width="100%"
                    disabled={disabled}
                  />
                </FieldCell>
                <DeleteCell>
                  <Button
                    icon="Delete"
                    iconSize={18}
                    onClick={() => onRemove(index)}
                    disabled={disabled}
                  />
                </DeleteCell>
              </ParameterRow>
            );
          })}
        </ParameterList>
      )}
    </Container>
  );
}

// ===== Styled Components =====

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

const ParameterList = styled.div`
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

const ParameterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FieldCell = styled.div`
  flex: 1;
`;

const DeleteCell = styled.div`
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
