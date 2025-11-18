"use client";

import { useAtom, useAtomValue } from "jotai";

import { hubPageAtom, hubSearchTextAtom } from "@/atoms/hub.atom";
import { CARD_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetHubs } from "@/hooks/hub/use-get-hubs";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 허브 목록 페이지 하단 푸터 컴포넌트
 *
 * 허브 목록 페이지에서 페이지네이션과 검색 기능을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 허브 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * 주요 기능:
 * - 페이지네이션 컨트롤 (이전/다음 페이지, 페이지 번호 선택)
 * - 총 허브 수 표시
 * - 페이지 크기 설정
 * - 페이지 변경 시 자동 상태 업데이트
 *
 * 데이터 흐름:
 * 1. Jotai atom을 통해 현재 페이지 번호와 검색 텍스트 상태 관리
 * 2. useGetHubs 훅을 통해 허브 목록 데이터 조회
 * 3. ListPageFooter 컴포넌트를 통해 페이지네이션 UI 렌더링
 * 4. 페이지 변경 시 hubPageAtom 상태 업데이트
 *
 * @returns 허브 목록 페이지 하단 푸터 컴포넌트
 */
export function HubListFooter() {
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(hubPageAtom);
  // 검색 텍스트 (읽기 전용 Jotai atom)
  const searchText = useAtomValue(hubSearchTextAtom);

  // 허브 목록 데이터 조회 (React Query 훅 사용)
  const { data, isLoading } = useGetHubs({
    page,
    size: CARD_PAGE_SIZE,
    searchText,
  });

  /**
   * 페이지 변경 핸들러
   * 사용자가 페이지네이션 컨트롤을 통해 페이지를 변경할 때 호출됩니다.
   *
   * @param page - 변경할 페이지 번호
   */
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={CARD_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
