"use client";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useAtom, useAtomValue } from "jotai";
import { useController, useFormContext } from "react-hook-form";
import styled from "styled-components";
import { Input, Typography } from "xiilab-ui";

import { CreateWorkloadEnv } from "@/domain/workload/components/create/create-workload-env";
// import { CreateWorkloadParameter } from "@/domain/workload/components/create/create-workload-parameter";
import { CreateWorkloadPort } from "@/domain/workload/components/create/create-workload-port";
import type { CreateWorkloadFormValues } from "@/domain/workload/schemas/create-workload.schema";
import {
  executionCmdAtom,
  executionDirectoryAtom,
  imageTypeAtom,
} from "@/domain/workload/state/create-workload.atom";
import { errorTextStyle } from "@/styles/mixins/text";
import { WORKLOAD_IMAGE_TYPES } from "../../constants/workload.constant";

export function CreateWorkloadFourthStep() {
  const imageType = useAtomValue(imageTypeAtom);
  const isHubImage = imageType === WORKLOAD_IMAGE_TYPES.HUB;
  const [executionDirectory, setExecutionDirectory] = useAtom(
    executionDirectoryAtom,
  );
  const [executionCmd, setExecutionCmd] = useAtom(executionCmdAtom);
  const { control } = useFormContext<CreateWorkloadFormValues>();
  const {
    field: executionDirectoryField,
    fieldState: executionDirectoryFieldState,
  } = useController({
    name: "executionDirectory",
    control,
  });
  const { field: executionCmdField, fieldState: executionCmdFieldState } =
    useController({
      name: "executionCmd",
      control,
    });

  const handleExecPathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    executionDirectoryField.onChange(nextValue);
    setExecutionDirectory(nextValue);
  };

  const handleExecCommandChange = (value: string) => {
    executionCmdField.onChange(value);
    setExecutionCmd(value);
  };

  return (
    <Container>
      <Section>
        <Field>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">Command</Typography.Text>
            <Typography.Text variant="body-2-4" color="#707070">
              (선택사항)
            </Typography.Text>
          </FieldHeader>
          <FieldItem>
            <Typography.Text variant="body-2-1" color="#484848">
              실행 경로
            </Typography.Text>
            <Input
              placeholder="실행 경로를 입력해 주세요."
              value={executionDirectory || ""}
              onChange={handleExecPathChange}
              maxLength={1000}
            />
            {executionDirectoryFieldState.error?.message && (
              <ErrorMessage>
                {executionDirectoryFieldState.error.message}
              </ErrorMessage>
            )}
          </FieldItem>
          <FieldItem>
            <Typography.Text variant="body-2-1" color="#484848">
              실행 명령어
            </Typography.Text>
            <CodeMirrorWrapper>
              <CodeMirror
                value={executionCmd || ""}
                width="100%"
                height="136px"
                theme={oneDark}
                extensions={[python(), javascript(), EditorView.lineWrapping]}
                onChange={handleExecCommandChange}
                placeholder="실행 명령어를 입력해 주세요."
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  highlightActiveLine: false,
                  highlightActiveLineGutter: false,
                }}
              />
            </CodeMirrorWrapper>
            {executionCmdFieldState.error?.message && (
              <ErrorMessage>
                {executionCmdFieldState.error.message}
              </ErrorMessage>
            )}
          </FieldItem>
        </Field>
      </Section>
      {!isHubImage && (
        <Section>
          <Field>
            <FieldHeader>
              <Typography.Text variant="subtitle-2-1">
                Variables
              </Typography.Text>
              <Typography.Text variant="body-2-4" color="#707070">
                (선택사항)
              </Typography.Text>
            </FieldHeader>

            <FieldItem>
              <CreateWorkloadEnv />
            </FieldItem>
            <FieldItem>
              <CreateWorkloadPort />
            </FieldItem>
          </Field>
        </Section>
      )}
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
`;

const FieldHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const CodeMirrorWrapper = styled.div`
  width: 100%;
  border-radius: 2px;
  overflow: hidden;

  .cm-editor {
    font-family: Pretendard, monospace;
    font-size: 12px;
    line-height: 14px;
  }

  .cm-scroller {
    font-family: Pretendard, monospace;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .cm-content {
    padding: 10px;
  }

  .cm-placeholder {
    color: #555555;
    font-family: Pretendard, sans-serif;
  }
`;

const FieldItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  & + & {
    margin-top: 16px;
  }
`;

const ErrorMessage = styled.div`
  ${errorTextStyle}
`;
