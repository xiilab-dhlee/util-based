"use client";

import { useAtomValue, useSetAtom } from "jotai";
import type { FormEvent } from "react";
import { Button } from "xiilab-ui";

import {
  openSelectVolumeModalAtom,
  volumePageAtom,
  volumeSearchTextAtom,
  volumeSelectedAtom,
} from "@/atoms/volume/volume-list.atom";
import { SearchInput } from "@/components/common/input/search-input";
import volumeListConstants from "@/constants/volume/volume-list.constant";
import { useGlobalModal } from "@/hooks/common/use-global-modal";
import { useSearch } from "@/hooks/common/use-search";
import { useGetVolumes } from "@/hooks/volume/use-get-volumes";
import { MySearchFilter } from "@/layouts/common/search-filter";

/**
 * 볼륨 목록 페이지 상단 필터 컴포넌트
 *
 * 볼륨 목록 페이지에서 검색어와 볼륨 타입을 필터링하는 기능을 제공합니다.
 * 볼륨 이름 검색과 타입별 정렬을 통해 원하는 볼륨을 빠르게 찾을 수 있습니다.
 *
 * @returns 볼륨 목록 페이지 상단 필터 컴포넌트
 */
export function VolumeListFilter() {
  const setSelectedVolume = useSetAtom(volumeSelectedAtom);
  const { onSubmit } = useSearch(volumeSearchTextAtom);
  const { onOpen } = useGlobalModal(openSelectVolumeModalAtom);

  const page = useAtomValue(volumePageAtom);

  const searchText = useAtomValue(volumeSearchTextAtom);

  const { data } = useGetVolumes({
    page,
    size: volumeListConstants.pageSize,
    searchText,
  });

  const handleCreateVolume = () => {
    onOpen();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // 검색 시 선택된 볼륨 초기화
    setSelectedVolume(null);
    onSubmit(e);
  };

  return (
    <MySearchFilter title="볼륨 목록" total={data?.totalSize}>
      <form onSubmit={handleSubmit}>
        <SearchInput />
      </form>
      <Button
        color="primary"
        icon="Plus"
        iconPosition="left"
        variant="gradient"
        width={100}
        height={30}
        onClick={handleCreateVolume}
      >
        볼륨 추가
      </Button>
    </MySearchFilter>
  );
}

