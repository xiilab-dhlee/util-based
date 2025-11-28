"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Button, Input, Typography } from "xiilab-ui";

import { CreateModelButton } from "@/shared/components/button/create-model-button";
import { envsAtom } from "../../state/create-workload.atom";

export function CreateWorkloadEnv() {
  const [envs, setEnvs] = useAtom(envsAtom);

  const handleCreate = () => {
    setEnvs((prev) => [...prev, { envKey: "", envValue: "" }]);
  };

  const handleDelete = (index: number) => {
    setEnvs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeEnv = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    setEnvs((prev) =>
      prev.map((variable, i) =>
        i === index ? { ...variable, [field]: value } : variable,
      ),
    );
  };

  return (
    <Container>
      <Header>
        <Typography.Text variant="body-2-1" color="#484848">
          환경변수
        </Typography.Text>
        <CreateModelButton title="환경변수 추가" onClick={handleCreate} />
      </Header>
      <Body>
        {envs.map((env, index) => (
          <Row key={env.envKey}>
            <StyledInput
              value={env.envKey}
              onChange={(e) => handleChangeEnv(index, "key", e.target.value)}
              placeholder="환경변수 키 입력"
            />
            <StyledInput
              value={env.envValue}
              onChange={(e) => handleChangeEnv(index, "value", e.target.value)}
              placeholder="환경변수 값 입력"
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
  /* gap: 8px; */
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
  flex: 1;
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
