import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";

import { UpdateUserButton } from "@/components/user/list/update-user-button";
import { UserAllCheck } from "@/components/user/list/user-all-check";
import { UserItemCheck } from "@/components/user/list/user-item-check";
import { UserStatusSwitch } from "@/components/user/list/user-status-switch";
import { ICON_COLUMN_WIDTH } from "@/constants/common/core.constant";
import type { UserListType } from "@/schemas/user.schema";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";
import type { CoreCreateColumnConfig } from "@/types/common/core.model";
import { applyColumnConfigs } from "@/utils/common/column.util";
import { MyIcon } from "../icon";

/**
 * 컬럼 정의 배열 생성 (dataIndex 한 번만 정의)
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <UserAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: UserListType) => {
        return <UserItemCheck user={record} />;
      },
    },
    {
      title: "이름",
      dataIndex: "name",
      align: "left",
    },
    {
      title: "이메일",
      dataIndex: "email",
      align: "left",
    },
    {
      title: "그룹",
      dataIndex: "group",
      align: "left",
    },
    {
      title: "권한",
      dataIndex: "role",
      align: "left",
    },
    {
      title: "가입일",
      dataIndex: "createdAt",
      align: "left",
      render: (createdAt: string) => {
        return <span>{format(createdAt, "yyyy.MM.dd")}</span>;
      },
    },
    {
      title: "상태",
      dataIndex: "status",
      align: "center",
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <UserStatusSwitch />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "수정",
      dataIndex: "update",
      align: "center",
      render: (_, user: UserListType) => {
        return (
          <ColumnAlignCenterWrap>
            <UpdateUserButton user={user} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "PW 초기화",
      dataIndex: "resetPassword",
      align: "center",
      width: 60,
      render: () => {
        return (
          <ColumnAlignCenterWrap>
            <ColumnIconWrap onClick={() => alert("준비 중입니다.")}>
              <MyIcon name="Notice" color="var(--icon-fill)" />
            </ColumnIconWrap>
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

/**
 * 사용자 목록 컬럼 생성
 *
 * @param config 컬럼 설정 (배열 형태)
 * @returns 컬럼 배열
 *
 * @example
 * // 1. 모든 컬럼 표시
 * const columns = createUserColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createUserColumn([
 *   { dataIndex: 'name' },
 *   { dataIndex: 'email' },
 *   { dataIndex: 'group' },
 *   { dataIndex: 'role' },
 * ]);
 *
 */
export const createUserColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
