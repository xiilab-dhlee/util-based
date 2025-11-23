"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import { useGetInternalRegistryImageTags } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-image-tags";
import {
  internalregistryImageTagCheckedListAtom,
  internalregistryImageTagPageAtom,
  internalregistryImageTagSearchTextAtom,
} from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 내부 레지스트리 이미지 태그 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 태그를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 internalregistryImageTagCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function InternalRegistryImageTagAllCheck() {
  const { id } = useParams();
  const [checkedList, setCheckedList] = useAtom(
    internalregistryImageTagCheckedListAtom,
  );
  const page = useAtomValue(internalregistryImageTagPageAtom);
  const searchText = useAtomValue(internalregistryImageTagSearchTextAtom);

  // 현재 페이지의 태그 목록 조회
  const { data } = useGetInternalRegistryImageTags({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    imageId: Number(id),
  });

  // 현재 페이지의 태그 ID 목록
  const currentPageIds = useMemo(() => {
    return data?.content?.map((item) => item.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 태그가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 태그가 선택되었는지 확인 (indeterminate 상태)
  const isIndeterminate = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    const checkedCount = currentPageIds.filter((id) =>
      checkedList.has(id),
    ).length;
    return checkedCount > 0 && checkedCount < currentPageIds.length;
  }, [currentPageIds, checkedList]);

  // 전체 선택/해제 처리
  const handleSelectAll = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        // 현재 페이지의 모든 태그 선택
        currentPageIds.forEach((id) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 태그 선택 해제
        currentPageIds.forEach((id) => {
          next.delete(id);
        });
      }

      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isAllChecked}
        indeterminate={isIndeterminate}
        onChange={(e) => handleSelectAll(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
