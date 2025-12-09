"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  volumeCheckedListAtom,
  volumePageAtom,
} from "@/domain/volume/state/volume.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { CARD_PAGE_SIZE } from "@/shared/constants/core.constant";
import { VOLUME_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface VolumeListFooterProps {
  /** 전체 볼륨 수 */
  total: number;
  /** 로딩 상태 */
  loading: boolean;
}

/**
 * 볼륨 목록 페이지 하단 푸터 컴포넌트
 *
 * 볼륨 목록 페이지에서 페이지네이션과 검색 기능을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 볼륨 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @param total - 전체 볼륨 수
 * @param loading - 로딩 상태
 */
export function VolumeListFooter({ total, loading }: VolumeListFooterProps) {
  const publish = usePublish();
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(volumePageAtom);
  // 체크된 볼륨 목록
  const selectedVolumes = useAtomValue(volumeCheckedListAtom);

  /**
   * 삭제 버튼 클릭 핸들러
   */
  const handleClickDelete = () => {
    // 삭제할 볼륨이 없으면 에러 메시지 표시
    if (selectedVolumes.size === 0) {
      toast.error("삭제할 볼륨을 선택해 주세요.");
      return;
    }
    // 삭제 모달에 데이터 전달
    publish(VOLUME_EVENTS.sendDeleteVolume, Array.from(selectedVolumes));
  };

  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={CARD_PAGE_SIZE}
      onChange={setPage}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
      isLoading={loading}
    />
  );
}
