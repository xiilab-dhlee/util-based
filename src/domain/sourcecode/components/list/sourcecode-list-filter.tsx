"use client";

import { useAtomValue } from "jotai";

import { useGetSourcecodes } from "@/domain/sourcecode/hooks/use-get-sourcecodes";
import {
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useSearch } from "@/shared/hooks/use-search";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";
import { SourcecodeTypeSort } from "./sourcecode-type-sort";

/**
 * 소스코드 목록 페이지 상단 필터 컴포넌트
 *
 * 소스코드 목록 페이지에서 검색어와 소스코드 타입을 필터링하는 기능을 제공합니다.
 * 소스코드 이름 검색과 타입별 정렬을 통해 원하는 소스코드를 빠르게 찾을 수 있습니다.
 *
 * @returns 소스코드 목록 페이지 상단 필터 컴포넌트
 */
export function SourcecodeListFilter() {
  const { onSubmit } = useSearch(sourcecodeSearchTextAtom);

  const page = useAtomValue(sourcecodePageAtom);

  const searchText = useAtomValue(sourcecodeSearchTextAtom);

  const { data } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  return (
    <MySearchFilter title="소스코드 목록" total={data?.totalSize}>
      <SourcecodeTypeSort />
      <form onSubmit={onSubmit}>
        <SearchInput />
      </form>
    </MySearchFilter>
  );
}
