"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { privateRegistryImageCheckedListAtom } from "@/atoms/private-registry-image/private-registry-image.atom";
import type { PrivateRegistryImageListType } from "@/schemas/private-registry-image.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface PrivateRegistryImageItemCheckProps {
  /** 이미지 데이터 */
  image: PrivateRegistryImageListType;
}

/**
 * 개별 내부 레지스트리 이미지 선택 체크박스 컴포넌트
 *
 * 개별 이미지를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 privateRegistryImageCheckedListAtom으로 관리됩니다.
 *
 * @param image - 이미지 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function PrivateRegistryImageItemCheck({
  image,
}: PrivateRegistryImageItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(
    privateRegistryImageCheckedListAtom,
  );

  // 현재 이미지가 선택되었는지 확인
  const isChecked = checkedList.has(image.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(image.id);
      } else {
        next.delete(image.id);
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
