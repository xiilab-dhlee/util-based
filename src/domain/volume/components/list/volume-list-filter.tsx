"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { usePathname } from "next/navigation";
import type { ChangeEvent } from "react";
import { Button, Input } from "xiilab-ui";

import { VolumeOrderSort } from "@/domain/volume/components/list/volume-order-sort";
import { VolumeTypeSort } from "@/domain/volume/components/list/volume-type-sort";
import {
  volumePageAtom,
  volumeSearchKeywordAtom,
  volumeSearchTextAtom,
} from "@/domain/volume/state/volume.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { isUserMode } from "@/shared/utils/router.util";

interface VolumeListFilterProps {
  total: number;
  loading: boolean;
}

export function VolumeListFilter({ total, loading }: VolumeListFilterProps) {
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useAtom(volumeSearchKeywordAtom);
  const setSearchText = useSetAtom(volumeSearchTextAtom);
  const resetPage = useResetAtom(volumePageAtom);
  const publish = usePublish();

  const isUser = isUserMode(pathname);

  const handleCreateVolume = () => {
    publish(VOLUME_EVENTS.openSelectStorageTypeModal);
  };

  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  const handleSearchKeywordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  return (
    <MySearchFilter title="볼륨 목록" total={total}>
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
