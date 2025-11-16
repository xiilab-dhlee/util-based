"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  volumeCheckedListAtom,
  volumePageAtom,
  volumeSearchTextAtom,
} from "@/atoms/volume/volume-list.atom";
import { ListDeleteButton } from "@/components/common/button/list-delete-button";
import { CARD_PAGE_SIZE } from "@/constants/common/core.constant";
import { VOLUME_EVENTS } from "@/constants/common/pubsub.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetVolumes } from "@/hooks/volume/use-get-volumes";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 볼륨 목록 페이지 하단 푸터 컴포넌트
 *
 * 볼륨 목록 페이지에서 페이지네이션과 검색 기능을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 볼륨 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @returns 볼륨 목록 페이지 하단 푸터 컴포넌트
 */
export function VolumeListFooter() {
  const publish = usePublish();
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(volumePageAtom);
  // 검색 텍스트 (읽기 전용 Jotai atom)
  const searchText = useAtomValue(volumeSearchTextAtom);
  // 체크된 볼륨 목록
  const selectedVolumes = useAtomValue(volumeCheckedListAtom);

  // 볼륨 목록 데이터 조회 (React Query 훅 사용)
  const { data, isLoading } = useGetVolumes({
    page,
    size: CARD_PAGE_SIZE,
    searchText,
  });

  /**
   * 페이지 변경 핸들러
   * @param page - 변경할 페이지 번호
   */
  const handlePage = (page: number) => {
    setPage(page);
  };

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
      total={data?.totalSize || 0}
      page={page}
      pageSize={CARD_PAGE_SIZE}
      onChange={handlePage}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
      isLoading={isLoading}
    />
  );
}
