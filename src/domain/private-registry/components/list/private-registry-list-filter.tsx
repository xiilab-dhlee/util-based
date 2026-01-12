"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Input } from "xiilab-ui";

import {
  openCreatePrivateRegistryModalAtom,
  privateregistryCheckedListAtom,
  privateregistryPageAtom,
  privateregistrySearchKeywordAtom,
  privateregistrySearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
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

  const { onOpen } = useGlobalModal(openCreatePrivateRegistryModalAtom);

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
    <MySearchFilter title="컨테이너 이미지 목록" total={totalSize}>
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
