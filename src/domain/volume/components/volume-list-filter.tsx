"use client";

import { useSetAtom } from "jotai";
import type { FormEvent } from "react";
import { Button } from "xiilab-ui";

import {
  openSelectVolumeModalAtom,
  volumeSearchTextAtom,
  volumeSelectedAtom,
} from "@/domain/volume/state/volume.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { useSearch } from "@/shared/hooks/use-search";

interface VolumeListFilterProps {
  /** 전체 볼륨 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 볼륨 목록 페이지 상단 필터 컴포넌트
 *
 * 볼륨 목록 페이지에서 검색어와 볼륨 타입을 필터링하는 기능을 제공합니다.
 * 볼륨 이름 검색과 타입별 정렬을 통해 원하는 볼륨을 빠르게 찾을 수 있습니다.
 *
 * @param total - 전체 볼륨 수
 * @param loading - 로딩 상태
 */
export function VolumeListFilter({ total, loading }: VolumeListFilterProps) {
  const setSelectedVolume = useSetAtom(volumeSelectedAtom);
  const { onSubmit } = useSearch(volumeSearchTextAtom);
  const { onOpen } = useGlobalModal(openSelectVolumeModalAtom);

  const handleCreateVolume = () => {
    onOpen();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // 검색 시 선택된 볼륨 초기화
    setSelectedVolume(null);
    onSubmit(e);
  };

  return (
    <MySearchFilter title="볼륨 목록" total={total}>
      <MyItemsOnlySwitch checked={true} />
      <form onSubmit={handleSubmit}>
        <SearchInput
          disabled={loading}
          placeholder="볼륨 또는 생성자 이름 검색"
        />
      </form>
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
