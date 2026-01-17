"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Input } from "xiilab-ui";

import {
  openSelectVolumeModalAtom,
  volumePageAtom,
  volumeSearchKeywordAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

interface VolumeListFilterProps {
  total: number;
  loading: boolean;
}

export function VolumeListFilter({ total, loading }: VolumeListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(volumeSearchKeywordAtom);
  const setSearchText = useSetAtom(volumeSearchTextAtom);
  const resetPage = useResetAtom(volumePageAtom);
  const { onOpen } = useGlobalModal(openSelectVolumeModalAtom);

  const handleCreateVolume = () => {
    onOpen();
  };

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
    <MySearchFilter title="볼륨 목록" total={total}>
      <MyItemsOnlySwitch checked={true} />
      <Input.Search
        name="search"
        placeholder="볼륨 이름을 검색해 주세요."
        onSearch={handleSearch}
        onChange={handleSearchKeywordChange}
        autoComplete="off"
        width={220}
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
        width={100}
        height={30}
        onClick={handleCreateVolume}
        disabled={loading}
      >
        볼륨 생성
      </Button>
    </MySearchFilter>
  );
}
