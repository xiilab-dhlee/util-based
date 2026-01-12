"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetPrivateImageTagList } from "@/api/generated/private-registry/private-registry";
import {
  privateregistryImageTagCheckedListAtom,
  privateregistryImageTagPageAtom,
  privateregistryImageTagSearchTextAtom,
} from "@/domain/private-registry/state/private-registry.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

/**
 * 프라이빗 레지스트리 이미지 태그 목록 전체 선택 체크박스 컴포넌트
 *
 * 현재 페이지의 모든 태그를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 privateregistryImageTagCheckedListAtom으로 관리됩니다.
 *
 * @returns 전체 선택 체크박스 컴포넌트
 */
export function PrivateRegistryTagAllCheck() {
  const { id } = useParams();
  const [checkedList, setCheckedList] = useAtom(
    privateregistryImageTagCheckedListAtom,
  );
  const page = useAtomValue(privateregistryImageTagPageAtom);
  const searchText = useAtomValue(privateregistryImageTagSearchTextAtom);

  // 현재 페이지의 태그 목록 조회
  const { data } = useGetPrivateImageTagList({
    pageNo: page - 1,
    pageSize: LIST_PAGE_SIZE,
    keyword: searchText,
    harborImageName: decodeURIComponent(id as string),
  });

  // 현재 페이지의 태그 ID 목록
  const currentPageIds = useMemo(() => {
    const content = data?.content || [];
    return content
      .map((item: ImageTagListResponse) => item.imageTagId)
      .filter((tagId): tagId is number => tagId !== undefined);
  }, [data?.content]);

  // 현재 페이지의 모든 태그가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((tagId: number) => checkedList.has(tagId));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 태그가 선택되었는지 확인 (indeterminate 상태)
  const isIndeterminate = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    const checkedCount = currentPageIds.filter((tagId: number) =>
      checkedList.has(tagId),
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
        currentPageIds.forEach((tagId: number) => {
          next.add(tagId);
        });
      } else {
        // 현재 페이지의 모든 태그 선택 해제
        currentPageIds.forEach((tagId: number) => {
          next.delete(tagId);
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
