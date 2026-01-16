"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import styled from "styled-components";

import { VolumeCard } from "@/domain/volume/components/volume-card";
import type { VolumeListType } from "@/domain/volume/schemas/volume.schema";
import { volumeSelectedAtom } from "@/domain/volume/state/volume.atom";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { MySpinner } from "@/shared/components/spinner";
import { GridList, ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface VolumeListBodyProps {
  /** 볼륨 목록 데이터 */
  content: VolumeListType[];
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 볼륨 목록 페이지 본문 컴포넌트
 *
 * 볼륨 목록 페이지에서 볼륨 목록을 표시하는 테이블을 제공합니다.
 * 페이지네이션과 검색 기능을 지원하며, 볼륨 데이터를 테이블 형태로 렌더링합니다.
 *
 * @param content - 볼륨 목록 데이터
 * @param loading - 로딩 상태
 */
export function VolumeListBody({ content, loading }: VolumeListBodyProps) {
  const [selectedVolume, setSelectedVolume] = useAtom(volumeSelectedAtom);

  // 데이터 변경 시 첫 번째 볼륨 자동 선택
  useEffect(() => {
    if (content.length > 0) {
      setSelectedVolume(content[0].uid);
    }
  }, [content, setSelectedVolume]);

  return (
    <ListWrapper>
      <StyledGridList>
        {loading && <MySpinner />}
        {content.length === 0 && <EmptyState />}
        {content.map((volume: VolumeListType) => (
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
  position: relative;

  --icon-fill: #5b29c7;
`;
