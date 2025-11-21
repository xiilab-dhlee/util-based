import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { UpdateWorkspaceMemberButton } from "@/domain/workspace-member/components/update-workspace-member-button";
import { WorkspaceMemberAllCheck } from "@/domain/workspace-member/components/workspace-member-all-check";
import { WorkspaceMemberItemCheck } from "@/domain/workspace-member/components/workspace-member-item-check";
import type { WorkspaceMemberListType } from "@/domain/workspace-member/schemas/workspace-member.schema";
import { ICON_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <WorkspaceMemberAllCheck />,
      dataIndex: "id",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_: string, record: WorkspaceMemberListType) => {
        return <WorkspaceMemberItemCheck workspaceMember={record} />;
      },
    },
    {
      title: "멤버 이름",
      dataIndex: "name",
      align: "left",
    },
    {
      title: "권한",
      dataIndex: "role",
      align: "center",
    },
    {
      title: "이메일",
      dataIndex: "email",
      align: "left",
    },
    {
      title: "워크스페이스 보유",
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
      dataIndex: "status",
      align: "center",
    },
    {
      title: "그룹",
      dataIndex: "group",
      align: "left",
    },
    {
      title: "수정",
      dataIndex: "update",
      align: "center",
      width: 50,
      render: (_, workspaceMember: WorkspaceMemberListType) => {
        return <UpdateWorkspaceMemberButton {...workspaceMember} />;
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
