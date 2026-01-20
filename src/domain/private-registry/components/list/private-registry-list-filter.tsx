"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Input } from "xiilab-ui";

import { PrivateRegistryTypeSort } from "@/domain/private-registry/components/list/private-registry-type-sort";
import {
  privateRegistryCheckedListAtom,
  privateRegistryPageAtom,
  privateRegistrySearchKeywordAtom,
  privateRegistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

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
  const setSearchText = useSetAtom(privateRegistrySearchTextAtom);
  const resetPage = useResetAtom(privateRegistryPageAtom);
  const resetCheckedList = useResetAtom(privateRegistryCheckedListAtom);

  const publish = usePublish();

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

  const handleCreatePrivateRegistryImage = () => {
    publish(PRIVATE_REGISTRY_EVENTS.openSelectTypeModal, null);
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
      <PrivateRegistryTypeSort disabled={loading} />
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
