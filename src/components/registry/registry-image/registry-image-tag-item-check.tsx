"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { privateRegistryImageTagCheckedListAtom } from "@/atoms/registry/private-registry-image-detail.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import type { RegistryImageTag } from "@/types/registry/registry.model";

interface RegistryImageTagItemCheckProps {
  /** 소스코드 데이터 */
  content: RegistryImageTag;
}

export function RegistryImageTagItemCheck({
  content,
}: RegistryImageTagItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(
    privateRegistryImageTagCheckedListAtom,
  );

  // 현재 소스코드가 선택되었는지 확인
  const isChecked = checkedList.has(content.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(content.id);
      } else {
        next.delete(content.id);
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

