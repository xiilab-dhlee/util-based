"use client";

import { useAtomValue } from "jotai";

import { nodePageAtom } from "@/atoms/node.atom";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { nodeListColumn } from "@/components/node/list/node-list-column";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
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
    size: LIST_PAGE_SIZE,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={nodeListColumn}
        data={data?.content || []}
        columnHeight={40}
      />
    </ListWrapper>
  );
}
