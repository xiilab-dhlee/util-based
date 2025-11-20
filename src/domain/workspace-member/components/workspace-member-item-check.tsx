"use client";

import { useAtom } from "jotai";
import { Checkbox } from "xiilab-ui";

import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { workspaceMemberCheckedListAtom } from "@/domain/workspace-member/state/workspace-member.atom";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

interface WorkspaceMemberItemCheckProps {
  /** 워크스페이스 데이터 */
  workspaceMember: WorkspaceMemberListType;
}

export function WorkspaceMemberItemCheck({
  workspaceMember,
}: WorkspaceMemberItemCheckProps) {
  const [checkedList, setCheckedList] = useAtom(workspaceMemberCheckedListAtom);

  // 현재 워크스페이스가 선택되었는지 확인
  const isChecked = checkedList.has(workspaceMember.id);

  // 개별 선택/해제 처리
  const handleSelect = (checked: boolean) => {
    setCheckedList((prev) => {
      // 기존 체크된 목록의 Set을 복사
      const next = new Set(prev);

      if (checked) {
        next.add(workspaceMember.id);
      } else {
        next.delete(workspaceMember.id);
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
