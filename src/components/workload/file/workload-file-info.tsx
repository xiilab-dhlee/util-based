"use client";
import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { workloadFileSelectedNodeInfoAtom } from "@/atoms/workload/workload-file.atom";
import { DetailContentKey } from "@/styles/layers/detail-page-layers.styled";

/**
 * 워크로드 파일 정보 컴포넌트
 *
 * 워크로드 파일 트리에서 선택된 파일/디렉토리의 정보를 표시하는 컴포넌트입니다.
 *
 * @returns 워크로드 파일 정보 컴포넌트
 */
export function WorkloadFileInfo() {
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);

  return (
    <Container>
      <KeyValueContainer>
        <DetailContentKey>파일 이름</DetailContentKey>
        <Value>{selectedNode?.name || ""}</Value>
      </KeyValueContainer>
      <KeyValueContainer>
        <DetailContentKey>파일 용량</DetailContentKey>
        <Value>{selectedNode?.fileSize || ""}B</Value>
      </KeyValueContainer>
      <KeyValueContainer>
        <DetailContentKey>상세 설명</DetailContentKey>
        <Description>
          파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠
          입니다. 다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠
          입니다.파일 컨텐츠 입니다. 파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일
          컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠
          입니다.
        </Description>
      </KeyValueContainer>
      {/* TODO: preview 작업 */}
    </Container>
  );
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const KeyValueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 34px;
  margin-bottom: 36px;
`;

const Value = styled(Typography.Text).attrs({
  variant: "body-2-4", // 14px → Use body-2-4 or similar, adjust weight
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #000;
`;

const Description = styled(Typography.Text).attrs({
  variant: "body-1-3", // 13px, 500 weight
})`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #000;
`;
