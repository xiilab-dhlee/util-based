"use client";

import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import {
  privateRegistryImageCheckedListAtom,
  privateRegistryImagePageAtom,
  privateRegistryImageSearchTextAtom,
} from "@/atoms/private-registry-image.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetPrivateRegistryImages } from "@/hooks/private-registry-image/use-get-private-registry-images";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 내부 레지스트리 이미지 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 이미지를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 privateRegistryImageCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function PrivateRegistryImageAllCheck() {
  const [checkedList, setCheckedList] = useAtom(
    privateRegistryImageCheckedListAtom,
  );
  const page = useAtomValue(privateRegistryImagePageAtom);
  const searchText = useAtomValue(privateRegistryImageSearchTextAtom);

  // 현재 페이지의 이미지 목록 조회
  const { data } = useGetPrivateRegistryImages({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
  });

  // 현재 페이지의 이미지 ID 목록
  const currentPageIds: number[] = useMemo(() => {
    return data?.content?.map((item) => item.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 이미지가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 이미지가 선택되었는지 확인 (indeterminate 상태)
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
      const next = new Set(prev);

      if (checked) {
        // 현재 페이지의 모든 이미지 ID를 추가
        currentPageIds.forEach((id) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 이미지 ID를 제거
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
