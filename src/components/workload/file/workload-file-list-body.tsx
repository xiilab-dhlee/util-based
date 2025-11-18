"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";

import {
  workloadFileSelectedNodeInfoAtom,
  workloadFileTreeDataAtom,
} from "@/atoms/workload.atom";
import { DetailContentKey } from "@/styles/layers/detail-page-layers.styled";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { EmptyFile } from "./empty-file";
import { WorkloadFileCard } from "./workload-file-card";

/**
 * 워크로드 파일 목록 본문 컴포넌트
 *
 * 워크로드 파일 트리에서 파일/디렉토리 목록을 표시하는 컴포넌트입니다.
 *
 * @returns 워크로드 파일 목록 본문 컴포넌트
 */
export function WorkloadFileListBody() {
  const treeData = useAtomValue(workloadFileTreeDataAtom);
  const selectedNode = useAtomValue(workloadFileSelectedNodeInfoAtom);

  // const selectedNode = findSelectedNode();
  // 전체 노드 표시
  const isAll = selectedNode === null;
  // 전체 노드가 비어있는 경우
  const isAllEmpty = isAll && treeData.length === 0;
  // 디렉토리 노드가 비어있는 경우
  const isEmpty =
    selectedNode?.children.length === 0 && selectedNode?.type === "directory";
  // 파일 노드인 경우
  const isFile = selectedNode?.type === "file";

  return (
    <ListWrapper>
      <FileGridWrapper>
        {isAll
          ? treeData.map((file, index) => (
              <WorkloadFileCard key={`${file.path}-${index}`} {...file} />
            ))
          : selectedNode.children.map((file, index) => (
              <WorkloadFileCard key={`${file.path}-${index}`} {...file} />
            ))}
      </FileGridWrapper>
      {isFile && (
        <FileInfoContainer>
          <KeyValueContainer>
            <DetailContentKey>파일 이름</DetailContentKey>
            <Value>Rice_Image_Dataset</Value>
          </KeyValueContainer>
          <KeyValueContainer>
            <DetailContentKey>파일 용량</DetailContentKey>
            <Value>5.04KB</Value>
          </KeyValueContainer>
          <KeyValueContainer>
            <DetailContentKey>상세 설명</DetailContentKey>
            <Description>
              파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일
              컨텐츠 입니다. 다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일
              컨텐츠 입니다.파일 컨텐츠 입니다. 파일 컨텐츠 입니다.파일 컨텐츠
              입니다.파일 컨텐츠 입니다.파일 컨텐츠 입니다.파일 컨텐츠
              입니다.파일 컨텐츠 입니다.
            </Description>
          </KeyValueContainer>
        </FileInfoContainer>
      )}
      {(isEmpty || isAllEmpty) && <EmptyFile />}
    </ListWrapper>
  );
}

const FileGridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;

const FileInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const KeyValueContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 34px;
`;

const Value = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #000;
  font-size: 14px;
  font-weight: 400;
`;

const Description = styled(Value)`
  font-size: 13px;
`;
