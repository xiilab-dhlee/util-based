"use client";

import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { createWorkspaceMemberColumn } from "@/shared/components/column/create-workspace-member-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface SettingMemberListBodyProps {
  /** 구성원 목록 데이터 */
  content: WorkspaceMemberListType[];
  /** 로딩 상태 */
  loading: boolean;
  /** 에러 상태 */
  isError: boolean;
}

/**
 * 설정 멤버 목록 본문 컴포넌트
 *
 * 구성원 목록의 테이블을 표시합니다.
 */
export function SettingMemberListBody({
  content,
  loading,
  isError,
}: SettingMemberListBodyProps) {
  return (
    <ListWrapper>
      <CustomizedTable
        columns={createWorkspaceMemberColumn([
          {
            key: "name",
            dataIndex: "name",
            title: "이름",
            width: "auto",
            sorter: true,
          },
          {
            dataIndex: "email",
            title: "이메일",
            width: "auto",
          },
          {
            dataIndex: "role",
            title: "권한",
            width: 100,
          },
          {
            dataIndex: "update",
            title: "권한 수정",
            width: 70,
          },
          {
            dataIndex: "delete",
            title: "삭제",
            width: 50,
          },
        ])}
        data={content}
        activePadding
        isError={isError}
        loading={loading}
        columnHeight={36}
      />
    </ListWrapper>
  );
}
