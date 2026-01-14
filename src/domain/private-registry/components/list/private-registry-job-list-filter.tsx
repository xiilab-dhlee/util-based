"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Dropdown, Input } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/private-registry/constants/private-registry.constant";
import {
  imageJobImageSourceTypeAtom,
  imageJobPageAtom,
  imageJobSearchKeywordAtom,
  imageJobSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { PRIVATE_REGISTRY_SELECTOR } from "@/shared/constants/selector.constant";

interface PrivateRegistryJobListFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function PrivateRegistryJobListFilter({
  totalSize,
  loading,
}: PrivateRegistryJobListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(imageJobSearchKeywordAtom);
  const [imageSourceType, setImageSourceType] = useAtom(
    imageJobImageSourceTypeAtom,
  );
  const setSearchText = useSetAtom(imageJobSearchTextAtom);
  const resetPage = useResetAtom(imageJobPageAtom);

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleSearchKeywordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchKeyword(e.target.value);
  };

  const handleImageSourceTypeChange = (
    value: GetPrivateRegistryListImageSourceType | "",
  ) => {
    resetPage();
    setImageSourceType(value || undefined);
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
      totalCountTestId={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_TOTAL_COUNT}
    >
      <Dropdown
        options={[ALL_OPTION, ...IMAGE_SOURCE_TYPE_OPTIONS]}
        value={imageSourceType ?? ""}
        onChange={handleImageSourceTypeChange}
        placeholder="구분"
        width={100}
        height={30}
        disabled={loading}
      />
      <Input.Search
        name="search"
        placeholder="컨테이너 이미지를 검색해 주세요."
        onSearch={handleSearch}
        onChange={handleSearchKeywordChange}
        autoComplete="off"
        width={240}
        height={30}
        disabled={loading}
        value={searchKeyword}
        data-testid={PRIVATE_REGISTRY_SELECTOR.JOB_LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
