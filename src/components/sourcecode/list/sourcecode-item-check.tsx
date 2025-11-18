"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import { sourcecodeCheckedListAtom } from "@/atoms/sourcecode.atom";
import type { SourcecodeListType } from "@/schemas/sourcecode.schema";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface SourcecodeItemCheckProps {
  /** 소스코드 데이터 */
  sourcecode: SourcecodeListType;
}

/**
 * 개별 소스코드 선택 체크박스 컴포넌트
 *
 * 개별 소스코드를 선택/해제할 수 있는 체크박스를 제공합니다.
 * 체크된 상태는 sourcecodeCheckedListAtom으로 관리됩니다.
 *
 * @param sourcecode - 소스코드 데이터
 * @returns 개별 선택 체크박스 컴포넌트
 */
export function SourcecodeItemCheck({ sourcecode }: SourcecodeItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(sourcecodeCheckedListAtom);

  // 현재 소스코드가 선택되었는지 확인
  const isChecked = checkedList.has(sourcecode.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(sourcecode.id);
      } else {
        next.delete(sourcecode.id);
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
