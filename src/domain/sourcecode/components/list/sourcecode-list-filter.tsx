"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { usePathname } from "next/navigation";
import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { SourcecodeTypeSort } from "@/domain/sourcecode/components/list/sourcecode-type-sort";
import {
  sourcecodePageAtom,
  sourcecodeSearchKeywordAtom,
  sourcecodeSearchTextAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

interface SourcecodeListFilterProps {
  total: number;
  loading: boolean;
}

export function SourcecodeListFilter({
  total,
  loading,
}: SourcecodeListFilterProps) {
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useAtom(
    sourcecodeSearchKeywordAtom,
  );
  const setSearchText = useSetAtom(sourcecodeSearchTextAtom);
  const resetPage = useResetAtom(sourcecodePageAtom);
  const publish = usePublish();

  const isUser = isUserMode(pathname);

  const handleCreateSourcecode = () => {
    publish(SOURCECODE_EVENTS.openCreateModal);
  };

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleSearchKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <MySearchFilter title="소스코드 목록" total={total}>
      <SourcecodeTypeSort disabled={loading} />
      <Input.Search
        name="search"
        placeholder="소스코드 이름을 검색해 주세요."
        onSearch={handleSearch}
        onChange={handleSearchKeywordChange}
        autoComplete="off"
        width={230}
        height={30}
        disabled={loading}
        value={searchKeyword}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
      {isUser && (
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
      )}
    </MySearchFilter>
  );
}
