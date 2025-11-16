"use client";

import { useAtomValue } from "jotai";

import { nodePageAtom } from "@/atoms/node/node-list.atom";
import { nodeListColumn } from "@/components/common/column/node-list-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import nodeListConstants from "@/constants/node/node-list.constant";
import { useGetNodes } from "@/hooks/node/use-get-nodes";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * 노드 목록 페이지 본문 컴포넌트
 *
 * 노드 목록 페이지에서 노드 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 노드 목록 페이지 본문 컴포넌트
 */
export function NodeListBody() {
  // 페이지 번호만 사용
  const page = useAtomValue(nodePageAtom);

  const { data } = useGetNodes({
    page,
    size: nodeListConstants.pageSize,
  });

  return (
    <ListWrapper>
      <CustomizedTable columns={nodeListColumn} data={data?.content || []} />
    </ListWrapper>
  );
}
