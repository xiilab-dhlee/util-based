"use client";

import { useAtom, useAtomValue } from "jotai";
import styled from "styled-components";
import { Icon, Tooltip, Typography } from "xiilab-ui";

import {
  jobTypeAtom,
  labelsAtom,
  nodeModeAtom,
} from "@/domain/workload/state/create-workload.atom";
import { MyMultipleSelect } from "@/shared/components/select/multiple";
import { CreateWorkloadSectionTitle } from "@/styles/layers/create-workload-layers.styled";

export function CreateWorkloadNode() {
  const [nodeMode, setNodeMode] = useAtom(nodeModeAtom);
  const [labels, setLabels] = useAtom(labelsAtom);
  const jobType = useAtomValue(jobTypeAtom);

  return (
    <Container>
      <Label>
        <CreateWorkloadSectionTitle className="required">
          노드
        </CreateWorkloadSectionTitle>
      </Label>
      <NodeModeContainer>
        <NodeModeButton
          $active={nodeMode === "single"}
          onClick={() => setNodeMode("single")}
        >
          <ButtonContent>
            <Icon
              name="SingleNode"
              size={24}
              color={nodeMode === "single" ? "#154FED" : "#404040"}
            />
            <Typography.Text
              variant={nodeMode === "single" ? "body-2-2" : "body-2-3"}
              color={nodeMode === "single" ? "#00144B" : "#000000"}
            >
              Single Node
            </Typography.Text>
            <Tooltip
              title={
                <TooltipContent>
                  프로젝트가 <TooltipHighlight>단일 노드</TooltipHighlight>
                  에서 실행.
                </TooltipContent>
              }
            >
              <TooltipIcon>
                <Icon name="Tooltip" size={16} color="#5F6368" />
              </TooltipIcon>
            </Tooltip>
          </ButtonContent>
        </NodeModeButton>

        {/* Interactive Job일 경우 Multi Node 버튼 숨김 */}
        {jobType !== "INTERACTIVE" && (
          <NodeModeButton
            $active={nodeMode === "multi"}
            onClick={() => setNodeMode("multi")}
          >
            <ButtonContent>
              <Icon
                name="MultiNode"
                size={24}
                color={nodeMode === "multi" ? "#154FED" : "#404040"}
              />
              <Typography.Text
                variant={nodeMode === "multi" ? "body-2-2" : "body-2-3"}
                color={nodeMode === "multi" ? "#00144B" : "#000000"}
              >
                Multi Node
              </Typography.Text>
              <Tooltip
                title={
                  <TooltipContent>
                    프로젝트가 <TooltipHighlight>다중 노드</TooltipHighlight>
                    에서 실행.
                    <br />
                    Horovod를 이용한 분산학습 시 선택.
                  </TooltipContent>
                }
              >
                <TooltipIcon>
                  <Icon name="Tooltip" size={16} color="#5F6368" />
                </TooltipIcon>
              </Tooltip>
            </ButtonContent>
          </NodeModeButton>
        )}
      </NodeModeContainer>
      <Label>
        <FieldLabelWithOptional>
          <CreateWorkloadSectionTitle>라벨</CreateWorkloadSectionTitle>
          <OptionalText>
            <Typography.Text variant="body-4-1" color="#707070">
              (선택사항)
            </Typography.Text>
          </OptionalText>
        </FieldLabelWithOptional>
      </Label>

      {/* 라벨 선택 */}
      <FieldContainer>
        <MyMultipleSelect
          options={[
            { label: "test", value: "test" },
            { label: "test2", value: "test2" },
            { label: "test3", value: "test3" },
          ]}
          value={labels}
          onChange={(value) => setLabels(value)}
        />
      </FieldContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fcfcfc;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
`;

// 필드 컨테이너들
const FieldContainer = styled.div`
  margin-bottom: 18px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  margin-bottom: 8px;
`;

const FieldLabelWithOptional = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const OptionalText = styled.span``;

// 노드 모드 버튼 컨테이너
const NodeModeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  width: 100%;
  margin-bottom: 18px;
`;

const NodeModeButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 7px 12px;
  border-radius: ${(props) => (props.$active ? "4px" : "2px")};
  border: 1px solid ${(props) => (props.$active ? "#3D3FDF" : "#B9BEC3")};
  background-color: ${(props) =>
    props.$active ? "rgba(54, 107, 255, 0.1)" : "#FAFAFA"};
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  height: 34px;

  ${(props) =>
    props.$active &&
    `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: rgba(54, 107, 255, 0.1);
      border-radius: 4px;
      z-index: -1;
    }
  `}

  &:hover {
    border-color: #3d3fdf;
    background-color: rgba(54, 107, 255, 0.1);
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
`;

const TooltipIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
`;

const TooltipContent = styled(Typography.Text).attrs({
  variant: "body-2-4", // 12px, 400 weight
})`
  line-height: 1.4;
`;

const TooltipHighlight = styled(Typography.Text).attrs({
  variant: "body-2-2", // 12px, 600 weight
})`
  color: #0022e0;
`;
