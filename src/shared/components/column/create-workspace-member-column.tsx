import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { getWorkspaceMemberRoleLabel } from "@/domain/workspace/constants/workspace.constant";
import { DeleteWorkspaceMemberButton } from "@/domain/workspace-member/components/delete-workspace-member-button";
import { UpdateWorkspaceMemberButton } from "@/domain/workspace-member/components/update-workspace-member-button";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: "멤버 이름",
      key: "name",
      dataIndex: "name",
      align: "left",
    },
    {
      title: "권한",
      key: "role",
      dataIndex: "role",
      align: "center",
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
      key: "email",
      dataIndex: "email",
      align: "left",
    },
    {
      title: "워크스페이스 보유",
      key: "workspaceCount",
      dataIndex: "workspaceCount",
      align: "center",
      width: 100,
      render: (workspaceCount: number) => {
        return (
          <ColumnAlignCenterWrap>{workspaceCount}개</ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "워크스페이스 생성 제한",
      key: "limitWorkspaceCreate",
      dataIndex: "limitWorkspaceCreate",
      align: "center",
      width: 120,
      render: (limitWorkspaceCreate: number) => {
        return (
          <ColumnAlignCenterWrap>
            {limitWorkspaceCreate}개
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "멤버 추가 날짜",
      key: "creatorDate",
      dataIndex: "creatorDate",
      align: "center",
      render: (creatorDate: string) => {
        return (
          <ColumnAlignCenterWrap>
            {format(creatorDate, "yyyy.MM.dd")}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "상태",
      key: "status",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "그룹",
      key: "group",
      dataIndex: "group",
      align: "left",
    },
    {
      title: "수정",
      key: "update",
      dataIndex: "update",
      align: "center",
      width: 50,
      render: (_, workspaceMember: WorkspaceMemberListType) => {
        return <UpdateWorkspaceMemberButton {...workspaceMember} />;
      },
    },
    {
      title: "삭제",
      key: "delete",
      dataIndex: "delete",
      width: 50,
      render: (_, workspaceMember: WorkspaceMemberListType) => {
        return <DeleteWorkspaceMemberButton {...workspaceMember} />;
      },
    },
  ];
};

/**
 * 워크스페이스 멤버 관련 테이블 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 */
export const createWorkspaceMemberColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
