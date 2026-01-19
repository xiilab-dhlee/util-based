"use client";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createMemberColumn } from "@/shared/components/column/create-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";

interface GroupMemberTableProps {
  data: GroupMemberResponse[];
  onRemove: (accountId: string) => void;
}

export function GroupMemberTable({ data, onRemove }: GroupMemberTableProps) {
  return (
    <CustomizedTable
      columns={createMemberColumn({ onRemove })}
      data={data}
      pagination={false}
      activePadding
      rowKey="accountId"
    />
  );
}
