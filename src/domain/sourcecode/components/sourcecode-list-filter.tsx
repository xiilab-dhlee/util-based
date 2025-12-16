"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button } from "xiilab-ui";

import { SourcecodeTypeSort } from "@/domain/sourcecode/components/sourcecode-type-sort";
import {
  openCreateSourcecodeModalAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
  sourcecodeSelectedAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

interface SourcecodeListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 소스코드 목록 페이지 상단 필터 컴포넌트
 *
 * 소스코드 목록 페이지에서 검색어와 소스코드 타입을 필터링하는 기능을 제공합니다.
 * 소스코드 이름 검색과 타입별 정렬을 통해 원하는 소스코드를 빠르게 찾을 수 있습니다.
 *
 * @param total - 전체 소스코드 수
 * @param loading - 로딩 상태
 * @returns 소스코드 목록 페이지 상단 필터 컴포넌트
 */
export function SourcecodeListFilter({
  total,
  loading,
}: SourcecodeListFilterProps) {
  const setSelectedSourcecode = useSetAtom(sourcecodeSelectedAtom);
  const setSearchText = useSetAtom(sourcecodeSearchTextAtom);
  const resetPage = useResetAtom(sourcecodePageAtom);
  const { onOpen } = useGlobalModal(openCreateSourcecodeModalAtom);

  const handleCreateSourcecode = () => {
    onOpen();
  };

  /**
   * 검색 핸들러
   * 검색 시 페이지와 선택된 소스코드를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSelectedSourcecode(null);
    setSearchText(value);
  };

  return (
    <MySearchFilter title="소스코드 목록" total={total}>
      <MyItemsOnlySwitch checked={true} />
      <SourcecodeTypeSort disabled={loading} />
      <SearchInput disabled={loading} onSearch={handleSearch} />
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={120}
        height={30}
        onClick={handleCreateSourcecode}
        disabled={loading}
      >
        소스코드 생성
      </Button>
    </MySearchFilter>
  );
}
