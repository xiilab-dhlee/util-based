"use client";

import { useAtom, useAtomValue } from "jotai";
import { toast } from "react-toastify";

import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { ListDeleteButton } from "@/shared/components/button/list-delete-button";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { SOURCECODE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";

interface SourcecodeListFooterProps {
  total: number;
  loading: boolean;
}

/**
 * 소스코드 목록 페이지 하단 푸터 컴포넌트
 *
 * 소스코드 목록 페이지에서 페이지네이션과 검색 기능을 제공하는 푸터 컴포넌트입니다.
 * 현재 페이지 번호, 총 소스코드 수, 페이지 크기를 표시하고,
 * 페이지 변경 시 상태를 업데이트합니다.
 *
 * @param total - 전체 소스코드 수
 * @param loading - 로딩 상태
 * @returns 소스코드 목록 페이지 하단 푸터 컴포넌트
 */
export function SourcecodeListFooter({
  total,
  loading,
}: SourcecodeListFooterProps) {
  const publish = usePublish();
  // 현재 페이지 번호 (읽기/쓰기 가능한 Jotai atom)
  const [page, setPage] = useAtom(sourcecodePageAtom);
  // 체크된 소스코드 목록
  const selectedSourcecodes = useAtomValue(sourcecodeCheckedListAtom);

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
      total={total}
      page={page}
      pageSize={LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={loading}
      rightChildren={<ListDeleteButton onClick={handleClickDelete} />}
    />
  );
}
