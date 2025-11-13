"use client";

import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";
import styled from "styled-components";

import {
  volumePageAtom,
  volumeSearchTextAtom,
  volumeSelectedAtom,
} from "@/atoms/volume/volume-list.atom";
import volumeListConstants from "@/constants/volume/volume-list.constant";
import { useGetVolumes } from "@/hooks/volume/use-get-volumes";
import { ListEmpty } from "@/layouts/list/list-empty";
import type { VolumeListType } from "@/schemas/volume.schema";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";
import VolumeCard from "./volume-card";

/**
 * 볼륨 목록 페이지 본문 컴포넌트
 *
 * 볼륨 목록 페이지에서 볼륨 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 검색 기능을 지원하며, 볼륨 데이터를 테이블 형태로 렌더링합니다.
 *
 * @returns 볼륨 목록 페이지 본문 컴포넌트
 */
export function VolumeListBody() {
  // 현재 페이지 번호 (Jotai atom에서 관리)
  const page = useAtomValue(volumePageAtom);
  // 검색 텍스트 (Jotai atom에서 관리)
  const searchText = useAtomValue(volumeSearchTextAtom);
  // 선택된 볼륨 (Jotai atom에서 관리)
  const [selectedVolume, setSelectedVolume] = useAtom(volumeSelectedAtom);

  // 볼륨 목록 데이터 조회 (React Query 훅 사용)
  const { data } = useGetVolumes({
    page,
    size: volumeListConstants.pageSize,
    searchText,
  });

  // 데이터 변경 시 첫 번째 볼륨 자동 선택
  useEffect(() => {
    const firstVolume = data?.content[0];
    if (firstVolume) {
      setSelectedVolume(firstVolume.uid);
    }
  }, [data, setSelectedVolume]);

  return (
    <ListWrapper>
      <StyledGridList>
        {data?.content.length === 0 && (
          <ListEmpty
            title="볼륨이 없습니다."
            message="볼륨을 생성하여 사용해보세요."
          />
        )}
        {data?.content.map((volume: VolumeListType) => (
          <VolumeCard
            key={volume.uid}
            isSelected={volume.uid === selectedVolume}
            {...volume}
          />
        ))}
      </StyledGridList>
    </ListWrapper>
  );
}


const StyledGridList = styled(GridList)`
  --icon-fill: #5b29c7;
`;
