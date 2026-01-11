import type { ResponsiveColumnType } from "xiilab-ui";

import type { WorkspaceMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { DeleteWorkspaceMemberButton } from "@/domain/setting/components/delete-workspace-member-button";
import { UpdateWorkspaceMemberRoleButton } from "@/domain/setting/components/update-workspace-member-role-button";
import { getWorkspaceMemberRoleLabel } from "@/domain/workspace/constants/workspace.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";

const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      key: "accountName",
      dataIndex: "accountName",
      title: "이름",
      align: "left",
      width: "30%",
      ellipsis: true,
    },
    {
      key: "email",
      dataIndex: "email",
      title: "이메일",
      align: "left",
      width: "35%",
      ellipsis: true,
    },
    {
      key: "memberRole",
      dataIndex: "memberRole",
      title: "권한",
      align: "center",
      width: "15%",
      render: (memberRole: WorkspaceMemberResponse["memberRole"]) =>
        getWorkspaceMemberRoleLabel(memberRole),
    },
    {
      key: "edit",
      dataIndex: "edit",
      title: "권한 수정",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <ColumnAlignCenterWrap>
            <UpdateWorkspaceMemberRoleButton member={record} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "delete",
      dataIndex: "delete",
      title: "삭제",
      align: "center",
      width: "10%",
      render: (_, record) => {
        return (
          <ColumnAlignCenterWrap>
            <DeleteWorkspaceMemberButton accountId={record.accountId} />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 설정 > 구성원 관리 테이블 컬럼 생성
 */
export const createWorkspaceMemberColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
