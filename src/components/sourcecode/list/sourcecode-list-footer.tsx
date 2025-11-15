"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
  sourcecodeSearchTextAtom,
} from "@/atoms/sourcecode/sourcecode-list.atom";
import { ListDeleteButton } from "@/components/common/buttons/list-delete-button";
import { SOURCECODE_EVENTS } from "@/constants/common/pubsub.constant";
import sourcecodeListConstants from "@/constants/sourcecode/sourcecode-list.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { useGetSourcecodes } from "@/hooks/sourcecode/use-get-sourcecodes";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

/**
 * 소스코드 목록 페이지 하단 푸터 컴포넌트
 *
 * 소스코드 목록 페이지에서 페이지네이션과 검색 기능을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 소스코드 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @returns 소스코드 목록 페이지 하단 푸터 컴포넌트
 */
export function SourcecodeListFooter() {
  const publish = usePublish();
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(sourcecodePageAtom);
  // 검색 텍스트 (읽기 전용 Jotai atom)
  const searchText = useAtomValue(sourcecodeSearchTextAtom);
  // 체크된 소스코드 목록
  const selectedSourcecodes = useAtomValue(sourcecodeCheckedListAtom);

  // 소스코드 목록 데이터 조회 (React Query 훅 사용)
  const { data, isLoading } = useGetSourcecodes({
    page,
    size: sourcecodeListConstants.pageSize,
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
    // 삭제할 소스코드가 없으면 에러 메시지 표시
    if (selectedSourcecodes.size === 0) {
      toast.error("삭제할 소스코드를 선택해 주세요.");
      return;
    }
    // 소스코드 삭제 모달에 데이터 전달
    publish(
      SOURCECODE_EVENTS.sendDeleteSourcecode,
      Array.from(selectedSourcecodes),
    );
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={sourcecodeListConstants.pageSize}
      onChange={handlePage}
      isLoading={isLoading}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}

