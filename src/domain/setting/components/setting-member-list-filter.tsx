"use client";

import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface SettingMemberListFilterProps {
  total?: number;
  searchValue: string;
  onChangeSearchValue: (next: string) => void;
  onSearch: (value: string) => void;
  onClickAddMember: () => void;
}

export function SettingMemberListFilter({
  total,
  searchValue,
  onChangeSearchValue,
  onSearch,
  onClickAddMember,
}: SettingMemberListFilterProps) {
  const handleSearch = (value: string) => {
    onSearch(value);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeSearchValue(e.target.value);
  };

  return (
    <MySearchFilter title="구성원 관리" total={total}>
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        value={searchValue}
        onChange={handleChange}
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
      />
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={110}
        height={30}
        onClick={onClickAddMember}
      >
        구성원 추가
      </Button>
    </MySearchFilter>
  );
}
