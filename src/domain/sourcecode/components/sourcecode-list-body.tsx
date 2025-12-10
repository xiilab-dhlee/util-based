"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { SourcecodeRow } from "@/domain/sourcecode/components/sourcecode-row";
import type { SourcecodeListType } from "@/domain/sourcecode/schemas/sourcecode.schema";
import { sourcecodeSelectedAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { createSourcecodeColumn } from "@/shared/components/column/create-sourcecode-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SourcecodeListBodyProps {
  content: SourcecodeListType[];
  loading: boolean;
}

/**
 * 소스코드 목록 페이지 본문 컴포넌트
 *
 * 소스코드 목록 페이지에서 소스코드 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 검색 기능을 지원하며, 소스코드 데이터를 테이블 형태로 렌더링합니다.
 *
 * @param content - 소스코드 목록 데이터
 * @param loading - 로딩 상태
 * @returns 소스코드 목록 페이지 본문 컴포넌트
 */
export function SourcecodeListBody({
  content,
  loading,
}: SourcecodeListBodyProps) {
  const setSelectedSourcecode = useSetAtom(sourcecodeSelectedAtom);

  // 데이터 변경 시 첫 번째 소스코드 자동 선택
  useEffect(() => {
    if (content.length > 0) {
      setSelectedSourcecode(content[0].id);
    }
  }, [content, setSelectedSourcecode]);

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createSourcecodeColumn([
          { dataIndex: "checkbox" },
          { dataIndex: "name", width: "20%", ellipsis: true, sorter: true },
          { dataIndex: "url", width: "15%", ellipsis: true },
          { dataIndex: "creatorName" },
          { dataIndex: "status" },
          { dataIndex: "type" },
          { dataIndex: "cmd", width: "15%", ellipsis: true },
          { dataIndex: "creatorDate" },
        ])}
        data={content}
        loading={loading}
        customRow={SourcecodeRow}
      />
    </ListWrapper>
  );
}
