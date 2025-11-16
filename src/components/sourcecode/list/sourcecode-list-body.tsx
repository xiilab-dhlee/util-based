"use client";

import { useAtomValue } from "jotai";

import {
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
} from "@/atoms/sourcecode/sourcecode-list.atom";
import { createSourcecodeColumn } from "@/components/common/column/create-sourcecode-column";
import { CustomizedTable } from "@/components/common/table/customized-table";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetSourcecodes } from "@/hooks/sourcecode/use-get-sourcecodes";
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

  const { data } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createSourcecodeColumn()}
        data={data?.content || []}
        customRow={SourcecodeRow}
      />
    </ListWrapper>
  );
}
