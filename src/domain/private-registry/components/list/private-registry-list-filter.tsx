"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Dropdown, Input } from "xiilab-ui";

import type { GetPrivateRegistryListImageSourceType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { IMAGE_SOURCE_TYPE_OPTIONS } from "@/domain/private-registry/constants/private-registry.constant";
import {
  openSelectPrivateRegistryTypeModalAtom,
  privateRegistryCheckedListAtom,
  privateRegistryImageSourceTypeAtom,
  privateRegistryPageAtom,
  privateRegistrySearchKeywordAtom,
  privateRegistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

interface PrivateRegistryListFilterProps {
  totalSize?: number;
  loading: boolean;
}

export function PrivateRegistryListFilter({
  totalSize,
  loading,
}: PrivateRegistryListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(
    privateRegistrySearchKeywordAtom,
  );
  const [imageSourceType, setImageSourceType] = useAtom(
    privateRegistryImageSourceTypeAtom,
  );
  const setSearchText = useSetAtom(privateRegistrySearchTextAtom);
  const resetPage = useResetAtom(privateRegistryPageAtom);
  const resetCheckedList = useResetAtom(privateRegistryCheckedListAtom);

  const { onOpen } = useGlobalModal(openSelectPrivateRegistryTypeModalAtom);

  const handleSearch = (value: string) => {
    resetCheckedList();
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
    resetCheckedList();
    resetPage();
    setImageSourceType(value || undefined);
  };

  const handleCreatePrivateRegistryImage = () => {
    onOpen();
  };

  return (
    <MySearchFilter
      title={
        <TooltipWrapper>
          컨테이너 이미지 목록
          <GuideTooltip
            iconSize={18}
            title="등록 완료된 이미지의 목록입니다."
          />
        </TooltipWrapper>
      }
      total={totalSize}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      <Dropdown
        options={[ALL_OPTION, ...IMAGE_SOURCE_TYPE_OPTIONS]}
        value={imageSourceType ?? ""}
        onChange={handleImageSourceTypeChange}
        placeholder="구분"
        width={120}
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
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={158}
        height={30}
        onClick={handleCreatePrivateRegistryImage}
        disabled={loading}
      >
        컨테이너 이미지 추가
      </Button>
    </MySearchFilter>
  );
}

const TooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
