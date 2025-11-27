"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { CreateWorkloadCustomSourcecode } from "./create-workload-custom-sourcecode";

export function CreateWorkloadThirdStep() {
  return (
    <Container>
      <Section>
        <Field>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">Input</Typography.Text>
            <Typography.Text variant="body-2-4" color="#707070">
              (선택사항)
            </Typography.Text>
          </FieldHeader>
        </Field>

        <CreateWorkloadCustomSourcecode />
      </Section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Section = styled.div`
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;
