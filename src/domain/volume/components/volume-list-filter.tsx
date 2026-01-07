"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Input } from "xiilab-ui";

import {
  openSelectVolumeModalAtom,
  volumePageAtom,
  volumeSearchTextAtom,
  volumeSelectedAtom,
} from "@/domain/volume/state/volume.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

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
  const setSearchText = useSetAtom(volumeSearchTextAtom);
  const resetPage = useResetAtom(volumePageAtom);
  const { onOpen } = useGlobalModal(openSelectVolumeModalAtom);

  const handleCreateVolume = () => {
    onOpen();
  };

  /**
   * 검색 핸들러
   * 검색 시 페이지와 선택된 볼륨을 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSelectedVolume(null);
    setSearchText(value.trim());
  };

  return (
    <MySearchFilter title="볼륨 목록" total={total}>
      <MyItemsOnlySwitch checked={true} />
      <Input.Search
        name="search"
        placeholder="볼륨 또는 생성자 이름 검색"
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
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
