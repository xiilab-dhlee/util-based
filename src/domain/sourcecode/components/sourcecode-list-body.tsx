"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

import { useGetSourcecodes } from "@/domain/sourcecode/hooks/use-get-sourcecodes";
import {
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSelectedAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { createSourcecodeColumn } from "@/shared/components/column/create-sourcecode-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { SourcecodeRow } from "./sourcecode-row";

/**
 * 소스코드 목록 페이지 본문 컴포넌트
 *
 * 소스코드 목록 페이지에서 소스코드 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 검색 기능을 지원하며, 소스코드 데이터를 테이블 형태로 렌더링합니다.
 *
 * @returns 소스코드 목록 페이지 본문 컴포넌트
 */
export function SourcecodeListBody() {
  const page = useAtomValue(sourcecodePageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  const [selectedSourcecode, setSelectedSourcecode] = useAtom(
    sourcecodeSelectedAtom,
  );

  const { data } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 데이터 변경 시 첫 번째 소스코드 자동 선택
  useEffect(() => {
    const firstSourcecode = data?.content[0];
    if (firstSourcecode && selectedSourcecode === null) {
      setSelectedSourcecode(firstSourcecode.id);
    }
  }, [data, selectedSourcecode, setSelectedSourcecode]);

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
        data={data?.content || []}
        customRow={SourcecodeRow}
      />
    </ListWrapper>
  );
}
