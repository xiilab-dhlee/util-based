"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { SourcecodeTypeSort } from "@/domain/sourcecode/components/list/sourcecode-type-sort";
import {
  sourcecodeCheckedListAtom,
  sourcecodeHasMineAtom,
  sourcecodePageAtom,
  sourcecodeSearchKeywordAtom,
  sourcecodeSearchTextAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import type { SourcecodeMode } from "@/domain/sourcecode/types/sourcecode.type";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SourcecodeListFilterProps {
  mode: SourcecodeMode;
  total: number;
  loading: boolean;
}

export function SourcecodeListFilter({
  mode,
  total,
  loading,
}: SourcecodeListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(
    sourcecodeSearchKeywordAtom,
  );
  const [hasMine, setHasMine] = useAtom(sourcecodeHasMineAtom);
  const setSearchText = useSetAtom(sourcecodeSearchTextAtom);
  const resetPage = useResetAtom(sourcecodePageAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);
  const publish = usePublish();

  const isUser = mode === "user";

  const handleCreateSourcecode = () => {
    publish(SOURCECODE_EVENTS.openCreateModal);
  };

  const handleSearch = (value: string) => {
    resetPage();
    resetCheckedList();
    setSearchText(value.trim());
  };

  const handleHasMineChange = (checked: boolean) => {
    resetPage();
    resetCheckedList();
    setHasMine(checked);
  };

  const handleSearchKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <MySearchFilter title="소스코드 목록" total={total}>
      {isUser && (
        <MyItemsOnlySwitch checked={hasMine} onChange={handleHasMineChange} />
      )}
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
