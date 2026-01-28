import type { ResponsiveColumnType } from "xiilab-ui";

import { getWorkspaceMemberRoleLabel } from "@/domain/workspace/constants/workspace.constant";
import { UpdateWorkspaceMemberButton } from "@/domain/workspace-member/components/update-workspace-member-button";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { formatDateSafely } from "@/shared/utils/date.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
export const workspaceMemberColumn: ResponsiveColumnType[] = [
  {
    title: "이름",
    dataIndex: "name",
    align: "left",
  },
  {
    title: "권한",
    dataIndex: "role",
    align: "center",
    width: 100,
    render: (role: WorkspaceMemberListType["role"]) => {
      return (
        <ColumnAlignCenterWrap>
          {getWorkspaceMemberRoleLabel(role)}
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "이메일",
    dataIndex: "email",
    align: "left",
  },
  {
    title: "등록일",
    dataIndex: "creatorDate",
    align: "center",
    render: (creatorDate: string) => {
      return (
        <ColumnAlignCenterWrap>
          {formatDateSafely(creatorDate) ?? "-"}
        </ColumnAlignCenterWrap>
      );
    },
  },

  {
    title: "그룹",
    dataIndex: "group",
    align: "left",
  },
  {
    title: "수정",
    dataIndex: "id",
    align: "center",
    width: 50,
    render: (_: number, workspaceMember: WorkspaceMemberListType) => {
      return <UpdateWorkspaceMemberButton {...workspaceMember} />;
    },
  },
];
