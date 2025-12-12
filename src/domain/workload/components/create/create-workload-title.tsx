"use client";

import { useAtom } from "jotai";
import styled from "styled-components";
import { Form, Input, TextArea } from "xiilab-ui";

import {
  workloadDescriptionAtom,
  workloadNameAtom,
} from "@/domain/workload/state/create-workload.atom";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

export function CreateWorkloadTitle() {
  const [workloadName, setWorkloadName] = useAtom(workloadNameAtom);
  const [description, setDescription] = useAtom(workloadDescriptionAtom);

  return (
    <Container>
      <Header>
        <CreateWorkloadSectionTitle>워크로드 정보</CreateWorkloadSectionTitle>
      </Header>
      <Form layout="vertical">
        {/* TODO: Add form validation - track validation state and display errors */}
        <FormItem label="워크로드 이름" required>
          <Input
            data-testid={WORKLOAD_SELECTOR.CREATE_NAME}
            value={workloadName}
            onChange={(e) => setWorkloadName(e.target.value)}
            placeholder="워크로드 이름을 30자 이내로 입력해 주세요. (특수문자는 ( -, _ , -, / ) 만 사용 가능)"
            width="100%"
          />
        </FormItem>

        <FormItem label="워크로드 설명" className="description">
          <TextArea
            data-testid={WORKLOAD_SELECTOR.CREATE_DESCRIPTION}
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
