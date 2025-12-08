"use client";

import { useAtomValue, useSetAtom } from "jotai";
import type { FormEvent } from "react";
import styled from "styled-components";
import { Button, Checkbox } from "xiilab-ui";

import { useGetSourcecodes } from "@/domain/sourcecode/hooks/use-get-sourcecodes";
import {
  openCreateSourcecodeModalAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSelectedAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSearch } from "@/shared/hooks/use-search";
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
  const setSelectedSourcecode = useSetAtom(sourcecodeSelectedAtom);
  const { onSubmit } = useSearch(sourcecodeSearchTextAtom);
  const { onOpen } = useGlobalModal(openCreateSourcecodeModalAtom);

  const page = useAtomValue(sourcecodePageAtom);
  const searchText = useAtomValue(sourcecodeSearchTextAtom);

  const { data } = useGetSourcecodes({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  const handleCreateSourcecode = () => {
    onOpen();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // 검색 시 선택된 소스코드 초기화
    setSelectedSourcecode(null);
    onSubmit(e);
  };

  return (
    <MySearchFilter title="소스코드 목록" total={data?.totalSize}>
      <Container>
        <Left>
          <Checkbox size="small">내가 생성한 소스코드 보기</Checkbox>
        </Left>
        <Right>
          <SourcecodeTypeSort />
          <form onSubmit={handleSubmit}>
            <SearchInput />
          </form>
          <Button
            color="primary"
            icon="Plus"
            iconPosition="left"
            variant="gradient"
            width={120}
            height={30}
            onClick={handleCreateSourcecode}
          >
            소스코드 생성
          </Button>
        </Right>
      </Container>
    </MySearchFilter>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const Left = styled.div`
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & .ant-checkbox-label {
    padding-left: 0;
    margin-left: 4px !important;
    line-height: 16px;
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;
