"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { privateregistryImageTagCheckedListAtom } from "@/domain/private-registry/state/private-registry.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface PrivateRegistryTagItemCheckProps {
  /** 태그 데이터 */
  tag: ImageTagListResponse;
}

/**
 * 개별 프라이빗 레지스트리 이미지 태그 선택 체크박스 컴포넌트
 *
 * 개별 태그를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 privateregistryImageTagCheckedListAtom으로 관리됩니다.
 *
 * @param tag - 태그 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function PrivateRegistryTagItemCheck({
  tag,
}: PrivateRegistryTagItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(
    privateregistryImageTagCheckedListAtom,
  );

  // 현재 태그가 선택되었는지 확인
  const isChecked =
    tag.imageTagId !== undefined && checkedList.has(tag.imageTagId);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    if (tag.imageTagId === undefined) return;

    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(tag.imageTagId!);
      } else {
        next.delete(tag.imageTagId!);
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
