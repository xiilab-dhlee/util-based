"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Form, Input, TextArea } from "xiilab-ui";

import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";
import {
  workloadDescriptionAtom,
  workloadNameAtom,
} from "../../state/create-workload.atom";

export function CreateWorkloadTitle() {
  const [workloadName, setWorkloadName] = useAtom(workloadNameAtom);
  const [description, setDescription] = useAtom(workloadDescriptionAtom);

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle className="required">
          워크로드 정보
        </CreateWorkloadSectionTitle>
      </Header>
      <Form layout="vertical">
        <FormItem
          label="워크로드 이름"
          // validateStatus="error"
          // help="워크로드 이름을 입력하세요."
        >
          <Input
            value={workloadName}
            onChange={(e) => setWorkloadName(e.target.value)}
            placeholder="워크로드 이름을 30자 이내로 입력해 주세요. (특수문자는 ( -, _ , -, / ) 만 사용 가능)"
            // status={validation.errors.workloadName ? "error" : "default"}
            width="100%"
          />
        </FormItem>

        <FormItem label="워크로드 설명" className="description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="워크로드 설명을 입력해 주세요."
            width="100%"
            height="100px"
            resize="none"
          />
        </FormItem>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid var(--color-gray-10);
  background: var(--color-gray-17);
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 12px;
`;

const FormItem = styled(Form.Item)`

  & label {
    font-weight: 600 !important;
    font-size: 12px !important;
  }

  &.description {
    margin-bottom: 0px !important;
  }
`;
