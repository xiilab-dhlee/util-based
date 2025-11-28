"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Button, Input, Typography } from "xiilab-ui";

import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { portsAtom } from "../../state/create-workload.atom";

export function CreateWorkloadPort() {
  const [ports, setPorts] = useAtom(portsAtom);

  const handleCreate = () => {
    setPorts((prev) => [...prev, { portName: "", port: "", servicePort: "" }]);
  };

  const handleDelete = (index: number) => {
    setPorts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: "name" | "port" | "servicePort",
    value: string,
  ) => {
    setPorts(
      ports.map((port, i) =>
        i === index ? { ...port, [field]: value } : port,
      ),
    );
  };

  return (
    <Container>
      <Header>
        <Typography.Text variant="body-2-1" color="#484848">
          포트
        </Typography.Text>
        <CreateModelButton title="포트 추가" onClick={handleCreate} />
      </Header>
      <Body>
        {ports.map((port, index) => (
          <Row key={port.portName}>
            <StyledInput
              value={port.portName}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              placeholder="포트 이름 입력"
            />
            <StyledInput
              value={port.port}
              onChange={(e) => handleChange(index, "port", e.target.value)}
              placeholder="포트 번호 입력"
            />
            <StyledInput
              value={port.servicePort}
              onChange={(e) =>
                handleChange(index, "servicePort", e.target.value)
              }
              placeholder="서비스 포트 번호 입력"
            />
            <Delete>
              <Button
                icon="Close"
                iconSize={18}
                onClick={() => handleDelete(index)}
              />
            </Delete>
          </Row>
        ))}
      </Body>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Header = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StyledInput = styled(Input)`
 width: 160px;
 height: 30px;
`;

const Delete = styled.div`
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  & > button {
    width: 30px !important;
    height: 30px !important;
  }
`;
