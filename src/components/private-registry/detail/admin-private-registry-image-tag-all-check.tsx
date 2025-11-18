"use client";

import { useAtom, useAtomValue } from "jotai";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Checkbox } from "xiilab-ui";

import {
  adminPrivateRegistryImageTagCheckedListAtom,
  adminPrivateRegistryImageTagPageAtom,
  adminPrivateRegistryImageTagSearchTextAtom,
} from "@/atoms/private-registry-image.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetAdminPrivateRegistryImageTags } from "@/hooks/private-registry-image/use-get-admin-private-registry-image-tags";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

export function AdminPrivateRegistryImageTagAllCheck() {
  const { id, name } = useParams();
  const [checkedList, setCheckedList] = useAtom(
    adminPrivateRegistryImageTagCheckedListAtom,
  );
  const page = useAtomValue(adminPrivateRegistryImageTagPageAtom);
  const searchText = useAtomValue(adminPrivateRegistryImageTagSearchTextAtom);

  const { data } = useGetAdminPrivateRegistryImageTags({
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    registryName: String(name),
    imageId: Number(id),
  });

  // 현재 페이지의 소스코드 ID 목록
  const currentPageIds = useMemo(() => {
    return data?.content?.map((item) => item.id) || [];
  }, [data?.content]);

  // 현재 페이지의 모든 소스코드가 선택되었는지 확인
  const isAllChecked = useMemo(() => {
    if (currentPageIds.length === 0) return false;
    return currentPageIds.every((id) => checkedList.has(id));
  }, [currentPageIds, checkedList]);

  // 현재 페이지의 일부 소스코드가 선택되었는지 확인 (indeterminate 상태)
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
        // 현재 페이지의 모든 소스코드 선택
        currentPageIds.forEach((id) => {
          next.add(id);
        });
      } else {
        // 현재 페이지의 모든 소스코드 선택 해제
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
