"use client";

import { useAtom } from "jotai";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { Button, Icon, Input, Typography } from "xiilab-ui";
import type { ZodIssue } from "zod";

import {
  type CreateWorkloadFormValues,
  portFormSchema,
} from "@/domain/workload/schemas/create-workload.schema";
import { portsAtom } from "@/domain/workload/state/create-workload.atom";

const portItemSchema = portFormSchema;
const PORT_NAME_RULE_MESSAGE =
  "포트 이름은 RFC6335 규칙을 따라야 합니다: 1~15자, 소문자/숫자/하이픈, 최소 1개 영문자, 연속 하이픈 불가";

const getPortIssueMessage = (issue: ZodIssue): string => {
  const field = issue.path[0];

  if (issue.code === "invalid_string" && field === "portName") {
    return PORT_NAME_RULE_MESSAGE;
  }

  if (issue.code === "too_small") {
    if (field === "portName") return "포트 이름을 입력해 주세요.";
  }

  if (issue.code === "too_big") {
    if (field === "portName") return PORT_NAME_RULE_MESSAGE;
    if (field === "portNumber") return "포트 번호는 1~65535 사이여야 합니다.";
    if (field === "servicePortNum") {
      return "서비스 포트 번호는 1~65535 사이여야 합니다.";
    }
  }

  if (issue.code === "invalid_type") {
    if (field === "portName") return "포트 이름을 입력해 주세요.";
    if (field === "portNumber") return "포트 번호를 입력해 주세요.";
  }

  return "입력값을 확인해 주세요.";
};

const parseNumberInput = (value: string): number | undefined => {
  const trimmedValue = value.trim();
  if (trimmedValue.length === 0) return undefined;

  const parsed = Number.parseInt(trimmedValue, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const hasDuplicatePortName = (
  ports: NonNullable<CreateWorkloadFormValues["port"]>,
  name: string,
  ignoreIndex?: number,
): boolean => {
  if (name.trim().length === 0) return false;
  return ports.some(
    (port, index) =>
      port.portName === name &&
      (ignoreIndex === undefined || index !== ignoreIndex),
  );
};

export function CreateWorkloadPort() {
  const [ports, setPorts] = useAtom(portsAtom);
  const { control, trigger } = useFormContext<CreateWorkloadFormValues>();
  const { field: portsField, fieldState: portsFieldState } = useController({
    name: "port",
    control,
  });
  const [tempPortName, setTempPortName] = useState("");
  const [tempPortNumber, setTempPortNumber] = useState("");
  const [tempServicePortNumber, setTempServicePortNumber] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const updatePorts = (nextPorts: typeof ports) => {
    portsField.onChange(nextPorts);
    setPorts(nextPorts);
    void trigger("port");
  };

  const handleCreate = () => {
    const portNumber = parseNumberInput(tempPortNumber);
    const servicePortNum = parseNumberInput(tempServicePortNumber);
    const nextPort = {
      portName: tempPortName.trim(),
      portNumber,
      servicePortNum,
    };

    const validationResult = portItemSchema.safeParse(nextPort);
    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      setInputError(
        issue ? getPortIssueMessage(issue) : "입력값을 확인해 주세요.",
      );
      return;
    }

    if (hasDuplicatePortName(ports, nextPort.portName)) {
      setInputError("이미 존재하는 포트 이름입니다.");
      return;
    }

    updatePorts([...ports, validationResult.data]);
    setTempPortName("");
    setTempPortNumber("");
    setTempServicePortNumber("");
    setInputError(null);
  };

  const handleDelete = (index: number) => {
    updatePorts(ports.filter((_, i) => i !== index));
  };

  const handleChangePortName = (index: number, value: string) => {
    updatePorts(
      ports.map((port, i) =>
        i === index ? { ...port, portName: value } : port,
      ),
    );
  };

  const handleChangePortNumber = (index: number, value: string) => {
    const parsedPortNumber = parseNumberInput(value);
    if (parsedPortNumber === undefined) {
      return;
    }
    updatePorts(
      ports.map((port, i) =>
        i === index
          ? {
              ...port,
              portNumber: parsedPortNumber,
            }
          : port,
      ),
    );
  };

  const handleChangeServicePortNum = (index: number, value: string) => {
    updatePorts(
      ports.map((port, i) =>
        i === index
          ? {
              ...port,
              servicePortNum: parseNumberInput(value),
            }
          : port,
      ),
    );
  };

  const handleTempPortNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempPortName(event.target.value);
    setInputError(null);
  };

  const handleTempPortNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTempPortNumber(event.target.value);
    setInputError(null);
  };

  const handleTempServicePortNumberChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTempServicePortNumber(event.target.value);
    setInputError(null);
  };

  const hasError = Boolean(inputError || portsFieldState.error?.message);

  return (
    <Container>
      <InputSection>
        <InputWrapper>
          <Input
            placeholder="포트 이름 입력"
            value={tempPortName}
            onChange={handleTempPortNameChange}
            width="100%"
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            placeholder="포트 번호 입력"
            value={tempPortNumber}
            onChange={handleTempPortNumberChange}
            width="100%"
            type="number"
            status={hasError ? "error" : undefined}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            placeholder="서비스 포트 번호 입력"
            value={tempServicePortNumber}
            onChange={handleTempServicePortNumberChange}
            width="100%"
            type="number"
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
      {(inputError || portsFieldState.error?.message) && (
        <ErrorMessage>
          {inputError || portsFieldState.error?.message}
        </ErrorMessage>
      )}
      {ports.length === 0 ? (
        <EmptyState>
          <EmptyIconCircle>
            <Icon name="Info" size={24} color="#FFFFFF" />
          </EmptyIconCircle>
          <EmptyText>
            <EmptyTitle>포트가 입력되지 않았습니다.</EmptyTitle>
            <EmptyDescription>
              포트 정보를 입력 후 추가해 주세요.
            </EmptyDescription>
          </EmptyText>
        </EmptyState>
      ) : (
        <PortList>
          <ListHeader>
            <HeaderCell>이름</HeaderCell>
            <HeaderCell>포트</HeaderCell>
            <HeaderCell>서비스 포트</HeaderCell>
            <DeletePlaceholder />
          </ListHeader>
          {ports.map((port, index) => (
            <PortRow
              key={`${port.portName}-${index}`}
              port={port}
              index={index}
              isDuplicateName={hasDuplicatePortName(
                ports,
                port.portName,
                index,
              )}
              onDelete={handleDelete}
              onChangePortName={handleChangePortName}
              onChangePortNumber={handleChangePortNumber}
              onChangeServicePortNum={handleChangeServicePortNum}
            />
          ))}
        </PortList>
      )}
    </Container>
  );
}

interface PortRowProps {
  port: NonNullable<CreateWorkloadFormValues["port"]>[number];
  index: number;
  isDuplicateName: boolean;
  onDelete: (index: number) => void;
  onChangePortName: (index: number, value: string) => void;
  onChangePortNumber: (index: number, value: string) => void;
  onChangeServicePortNum: (index: number, value: string) => void;
}

function PortRow({
  port,
  index,
  isDuplicateName,
  onDelete,
  onChangePortName,
  onChangePortNumber,
  onChangeServicePortNum,
}: PortRowProps) {
  const handleDeleteClick = () => {
    onDelete(index);
  };

  const handlePortNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangePortName(index, e.target.value);
  };

  const handlePortNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangePortNumber(index, e.target.value);
  };

  const handleServicePortNumChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeServicePortNum(index, e.target.value);
  };

  return (
    <Row>
      <FieldCell>
        <Input
          value={port.portName}
          onChange={handlePortNameChange}
          width="100%"
          status={isDuplicateName ? "error" : undefined}
          disabled
        />
      </FieldCell>
      <FieldCell>
        <Input
          type="number"
          value={port.portNumber?.toString() || ""}
          onChange={handlePortNumberChange}
          width="100%"
          disabled
        />
      </FieldCell>
      <FieldCell>
        <Input
          type="number"
          value={port.servicePortNum?.toString() || ""}
          onChange={handleServicePortNumChange}
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

const PortList = styled.div`
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
