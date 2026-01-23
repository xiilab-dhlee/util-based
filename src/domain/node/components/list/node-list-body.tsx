"use client";

import type { ClusterNodeListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createNodeColumn } from "@/domain/node/components/list/create-node-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface NodeListBodyProps {
  content: ClusterNodeListResponse[];
  loading: boolean;
  isError?: boolean;
}

/**
 * 노드 목록 페이지 본문 컴포넌트
 *
 * 노드 목록 페이지에서 노드 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 노드 목록 데이터
 * @param loading - 로딩 여부
 * @param isError - 에러 상태 여부
 * @returns 노드 목록 페이지 본문 컴포넌트
 */
export function NodeListBody({
  content,
  loading,
  isError = false,
}: NodeListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createNodeColumn()}
        data={content}
        columnHeight={40}
        loading={loading}
        isError={isError}
      />
    </ListWrapper>
  );
}
