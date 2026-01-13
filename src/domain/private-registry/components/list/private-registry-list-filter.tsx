"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Input } from "xiilab-ui";

import {
  openSelectPrivateRegistryTypeModalAtom,
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
  privateregistrySearchKeywordAtom,
  privateregistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
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
    privateregistrySearchKeywordAtom,
  );
  const setSearchText = useSetAtom(privateregistrySearchTextAtom);
  const resetPage = useResetAtom(privateregistryPageAtom);
  const resetCheckedList = useResetAtom(privateregistryCheckedListAtom);

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
