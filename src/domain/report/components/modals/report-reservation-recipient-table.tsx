"use client";

import {
  createMemberColumn,
  type MemberRow,
} from "@/shared/components/column/create-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";

interface ReportReservationRecipientTableProps {
  /** 테이블에 표시할 수신자 데이터 */
  data: MemberRow[];
  /** 수신자 삭제 핸들러 */
  onRemove: (id: string) => void;
}

/**
 * 리포트 예약 수신자 테이블 컴포넌트
 *
 * 선택된 수신자 목록을 테이블로 표시하고 삭제 기능 제공
 */
export function ReportReservationRecipientTable({
  data,
  onRemove,
}: ReportReservationRecipientTableProps) {
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
