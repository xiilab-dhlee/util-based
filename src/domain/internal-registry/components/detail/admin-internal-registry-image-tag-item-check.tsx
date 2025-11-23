"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import type { InternalRegistryImageTagListType } from "@/domain/internal-registry-image/schemas/internal-registry-image-tag.schema";
import { adminInternalRegistryImageTagCheckedListAtom } from "@/domain/internal-registry-image/state/internal-registry-image.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface AdminInternalRegistryImageTagItemCheckProps {
  /** 소스코드 데이터 */
  tag: InternalRegistryImageTagListType;
}

export function AdminInternalRegistryImageTagItemCheck({
  tag,
}: AdminInternalRegistryImageTagItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(
    adminInternalRegistryImageTagCheckedListAtom,
  );

  // 현재 소스코드가 선택되었는지 확인
  const isChecked = checkedList.has(tag.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(tag.id);
      } else {
        next.delete(tag.id);
      }

      return next;
    });
  };

  return (
    <ColumnAlignCenterWrap>
      <Checkbox
        size="small"
        checked={isChecked}
        onChange={(e) => handleSelect(e.target.checked)}
      />
    </ColumnAlignCenterWrap>
  );
}
