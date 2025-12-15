"use client";

import { useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import styled from "styled-components";
import { Button, Checkbox } from "xiilab-ui";

import {
  openSelectVolumeModalAtom,
  volumePageAtom,
  volumeSearchTextAtom,
  volumeSelectedAtom,
} from "@/domain/volume/state/volume.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
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
    setSearchText(value);
  };

  return (
    <MySearchFilter title="볼륨 목록" total={total}>
      <Container>
        <Left>
          <Checkbox size="small">내가 생성한 볼륨 보기</Checkbox>
        </Left>
        <Right>
          <SearchInput
            disabled={loading}
            placeholder="볼륨 또는 생성자 이름 검색"
            onSearch={handleSearch}
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
        </Right>
      </Container>
    </MySearchFilter>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const Left = styled.div`
  padding-left: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  & .ant-checkbox-label {
    padding-left: 0;
    margin-left: 4px !important;
    line-height: 16px;
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
`;
