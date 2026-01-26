"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { VolumeOrderSort } from "@/domain/volume/components/list/volume-order-sort";
import { VolumeTypeSort } from "@/domain/volume/components/list/volume-type-sort";
import {
  volumeCheckedListAtom,
  volumeHasMineAtom,
  volumePageAtom,
  volumeSearchKeywordAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import type { VolumeMode } from "@/domain/volume/types/volume.type";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface VolumeListFilterProps {
  mode: VolumeMode;
  total: number;
  loading: boolean;
}

export function VolumeListFilter({
  mode,
  total,
  loading,
}: VolumeListFilterProps) {
  const [searchKeyword, setSearchKeyword] = useAtom(volumeSearchKeywordAtom);
  const [hasMine, setHasMine] = useAtom(volumeHasMineAtom);
  const setSearchText = useSetAtom(volumeSearchTextAtom);
  const resetPage = useResetAtom(volumePageAtom);
  const resetCheckedList = useResetAtom(volumeCheckedListAtom);
  const publish = usePublish();

  const isUser = mode === "user";

  const handleCreateVolume = () => {
    publish(VOLUME_EVENTS.openSelectStorageTypeModal);
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
    <MySearchFilter title="볼륨 목록" total={total}>
      {isUser && (
        <MyItemsOnlySwitch checked={hasMine} onChange={handleHasMineChange} />
      )}
      <VolumeOrderSort disabled={loading} />
      <VolumeTypeSort disabled={loading} />
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
      {isUser && (
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
      )}
    </MySearchFilter>
  );
}
