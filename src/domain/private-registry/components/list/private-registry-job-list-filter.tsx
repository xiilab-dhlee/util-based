"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Input } from "xiilab-ui";

import {
  pullPushJobPageAtom,
  pullPushJobSearchKeywordAtom,
  pullPushJobSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";

interface PrivateRegistryJobListFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function PrivateRegistryJobListFilter({
  totalSize,
  loading,
}: PrivateRegistryJobListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(
    pullPushJobSearchKeywordAtom,
  );
  const setSearchText = useSetAtom(pullPushJobSearchTextAtom);
  const resetPage = useResetAtom(pullPushJobPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <MySearchFilter
      title={
        <TooltipWrapper>
          등록 중인 이미지 목록
          <GuideTooltip
            iconSize={18}
            title={
              <>
                <span>Pull 또는 Push가 진행 중인 Job 목록입니다.</span>
                <br />
                <span>Job은 성공/실패 상관없이 24시간 뒤에 삭제됩니다.</span>
              </>
            }
          />
        </TooltipWrapper>
      }
      total={totalSize}
    >
      <Input.Search
        name="search"
        placeholder="컨테이너 이미지를 검색해 주세요."
        onSearch={handleSearch}
        onChange={handleSearchKeywordChange}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
        value={searchKeyword}
      />
    </MySearchFilter>
  );
}

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
