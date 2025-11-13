"use client";

import { useAtom } from "jotai";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";

import {
  workloadFileSelectedNodeInfoAtom,
  workloadFileTreeDataAtom,
} from "@/atoms/workload/workload-file.atom";
import { CustomFileTree } from "@/components/common/tree/custom-file-tree";
import { useGetWorkloadFiles } from "@/hooks/workload/use-get-workload-files";
import type { FileTreeType } from "@/schemas/filetree.schema";
import {
  DetailContentButton,
  DetailContentHeader,
  DetailContentTitle,
  DetailContentTitleTool,
} from "@/styles/layers/detail-page-layers.styled";
import { WorkloadFileButton } from "./workload-file-button";
import { WorkloadFileCheckbox } from "./workload-file-checkbox";
import { WorkloadFileListBody } from "./workload-file-list-body";

/**
 * 워크로드 파일 관리 메인 컴포넌트
 *
 * 워크로드의 파일 시스템을 관리하는 메인 컴포넌트로, 파일 트리와 파일 목록을
 * 좌우 분할 레이아웃으로 표시합니다. 파일 업로드, 다운로드, 폴더 추가 등의
 * 기능을 제공합니다.
 *
 * @returns 워크로드 파일 관리 인터페이스
 */
export function WorkloadFileMain() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const workspaceId = searchParams?.get("workspaceId") || "";

  // 현재 선택된 파일/폴더 노드 정보
  const selectedNode = useAtom(workloadFileSelectedNodeInfoAtom)[0];
  // 파일 트리 데이터 상태 관리
  const [treeData, setTreeData] = useAtom(workloadFileTreeDataAtom);

  // 워크로드 파일 목록 조회 훅
  const { data } = useGetWorkloadFiles({
    workspaceId,
    workloadId: String(id),
    path: "/", // 루트 경로에서 시작
  });

  /**
   * 파일 목록 데이터가 변경될 때 트리 데이터 업데이트
   *
   * TODO: 파일 목록 조회 시마다 특정 노드의 children에 추가하도록 변경 필요
   */
  useEffect(() => {
    if (data?.content) {
      setTreeData(data.content);
    }
  }, [data?.content, setTreeData]);

  /**
   * 선택된 노드에 따른 제목 텍스트 반환
   */
  const getFileTitle = () => {
    if (!selectedNode) return "전체";
    return selectedNode.type === "directory"
      ? (selectedNode.name as string)
      : "기본 정보";
  };

  /**
   * 파일 개수 통계 텍스트 반환
   */
  const getFileTotalText = () => {
    const directoryCount = data?.directoryCnt || 0;
    const fileCount = data?.content.reduce(
      (acc: number, cur: FileTreeType) => acc + (Number(cur.fileCount) || 0),
      0,
    );
    return `폴더 ${directoryCount}개, 파일 ${fileCount}개`;
  };

  return (
    <>
      {/* 파일 페이지 영역 */}
      {/* 파일 관리 헤더 영역 */}
      <DetailContentHeader>
        <DetailContentTitle>파일목록</DetailContentTitle>
        {/* 파일 관리 도구 버튼들 */}
        <DetailContentTitleTool>
          <div style={{ width: 80, height: 30 }}>
            <DetailContentButton onClick={() => alert("폴더 추가 Action")}>
              폴더 추가
            </DetailContentButton>
          </div>
          <div style={{ width: 80, height: 30 }}>
            <DetailContentButton onClick={() => alert("업로드 Action")}>
              파일 업로드
            </DetailContentButton>
          </div>
          <div style={{ width: 80, height: 30 }}>
            <DetailContentButton onClick={() => alert("다운로드 Action")}>
              다운로드
            </DetailContentButton>
          </div>
        </DetailContentTitleTool>
      </DetailContentHeader>

      {/* 워크로드 파일 내용 - 좌우 분할 레이아웃 */}
      <FileContent>
        {/* 왼쪽: 파일 트리 영역 */}
        <Left>
          <FileContentHeader>
            <FileTitle>파일 리스트</FileTitle>
          </FileContentHeader>
          {/* 커스텀 파일 트리 컴포넌트 */}
          <CustomFileTree
            treeData={treeData} // 트리 데이터
            fileCheckbox={WorkloadFileCheckbox} // 파일 체크박스 컴포넌트
            fileButton={WorkloadFileButton} // 파일 버튼 컴포넌트
            isActiveRootNode
          />
        </Left>

        {/* 오른쪽: 파일 상세 정보 및 목록 영역 */}
        <Right>
          <FileContentHeader>
            {/* 선택된 노드에 따른 제목 표시 */}
            <FileTitle>{getFileTitle()}</FileTitle>
            {/* 폴더 및 파일 개수 통계 */}
            <FileTotal>{getFileTotalText()}</FileTotal>
          </FileContentHeader>
          {/* 파일 목록 본문 */}
          <WorkloadFileListBody />
        </Right>
      </FileContent>
    </>
  );
}

const FileContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: hidden;
`;

const Left = styled.div`
  width: 334px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Right = styled.div`
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const FileContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
`;

const FileTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const FileTotal = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: #828588;
`;
