"use client";

import {
  createMemberColumn,
  type MemberRow,
} from "@/shared/components/column/create-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";

interface GroupMemberTableProps {
  /** 테이블에 표시할 멤버 데이터 */
  data: MemberRow[];
  /** 멤버 삭제 핸들러 */
  onRemove: (id: string) => void;
}

/**
 * 그룹 멤버 테이블 컴포넌트
 *
 * 선택된 멤버 목록을 테이블로 표시하고 삭제 기능 제공
 */
export function GroupMemberTable({ data, onRemove }: GroupMemberTableProps) {
  return (
    <CustomizedTable
      columns={createMemberColumn({ onRemove })}
      data={data}
      pagination={false}
      activePadding
      rowKey="id"
    />
  );
}
