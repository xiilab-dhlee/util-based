"use client";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import { Input, Typography } from "xiilab-ui";

import {
  execCommandAtom,
  execPathAtom,
  imageTypeAtom,
} from "../../state/create-workload.atom";
import { CreateWorkloadEnv } from "./create-workload-env";
import { CreateWorkloadParameter } from "./create-workload-parameter";
import { CreateWorkloadPort } from "./create-workload-port";

export function CreateWorkloadFourthStep() {
  const imageType = useAtomValue(imageTypeAtom);
  const [execPath, setExecPath] = useAtom(execPathAtom);
  const [execCommand, setExecCommand] = useAtom(execCommandAtom);

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
              value={execPath || ""}
              onChange={(e) => setExecPath(e.target.value)}
            />
          </FieldItem>
          <FieldItem>
            <Typography.Text variant="body-2-1" color="#484848">
              실행 명령어
            </Typography.Text>
            <CodeMirrorWrapper>
              <CodeMirror
                value={execCommand || ""}
                height="136px"
                theme={oneDark}
                extensions={[python(), javascript()]}
                onChange={(value) => setExecCommand(value)}
                placeholder="실행 명령어를 입력해 주세요."
                basicSetup={{
                  lineNumbers: false,
                  foldGutter: false,
                  highlightActiveLine: false,
                  highlightActiveLineGutter: false,
                }}
              />
            </CodeMirrorWrapper>
          </FieldItem>
        </Field>
      </Section>
      <Section>
        <Field>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">Variables</Typography.Text>
            <Typography.Text variant="body-2-4" color="#707070">
              (선택사항)
            </Typography.Text>
          </FieldHeader>
          {imageType !== "HUB" && (
            <>
              <FieldItem>
                <CreateWorkloadEnv />
              </FieldItem>
              <FieldItem>
                <CreateWorkloadPort />
              </FieldItem>
            </>
          )}
        </Field>
      </Section>
      {/* <CreateWorkloadParameter /> */}
      <Section>
        <Field>
          <FieldHeader>
            <Typography.Text variant="subtitle-2-1">
              시간 예측 파라미터
            </Typography.Text>
            <Typography.Text variant="body-2-4" color="#707070">
              파라미터 값 입력 시, 워크로드의 종료 예상 시간을 확인할 수
              있습니다.
            </Typography.Text>
          </FieldHeader>
          {/* 시간 예측 파라미터 영역 */}
          {imageType === "HUB" && <CreateWorkloadParameter />}
        </Field>
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
