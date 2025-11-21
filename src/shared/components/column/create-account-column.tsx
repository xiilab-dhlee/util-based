import { format } from "date-fns";
import type { ResponsiveColumnType } from "xiilab-ui";
import { Icon } from "xiilab-ui";

import { AccountAllCheck } from "@/domain/account-management/components/list/account-all-check";
import { AccountItemCheck } from "@/domain/account-management/components/list/account-item-check";
import { AccountStatusSwitch } from "@/domain/account-management/components/list/account-status-switch";
import { UpdateAccountButton } from "@/domain/account-management/components/list/update-account-button";
import type { AccountListType } from "@/domain/account-management/schemas/account.schema";
import { ICON_COLUMN_WIDTH } from "@/shared/constants/core.constant";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

/**
 * 컬럼 정의 배열 생성 (dataIndex 한 번만 정의)
 */
const createColumnList = (): ResponsiveColumnType[] => {
  return [
    {
      title: <AccountAllCheck />,
      dataIndex: "checkbox",
      align: "center",
      width: ICON_COLUMN_WIDTH,
      render: (_, record: AccountListType) => {
        return <AccountItemCheck account={record} />;
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
            <AccountStatusSwitch />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      title: "수정",
      dataIndex: "update",
      align: "center",
      render: (_, account: AccountListType) => {
        return (
          <ColumnAlignCenterWrap>
            <UpdateAccountButton account={account} />
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
              <Icon name="Notice" color="var(--icon-fill)" />
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
 * const columns = createAccountColumn();
 *
 * @example
 * // 2. 배열 형태 - 순서 변경 가능
 * const columns = createAccountColumn([
 *   { dataIndex: 'name' },
 *   { dataIndex: 'email' },
 *   { dataIndex: 'group' },
 *   { dataIndex: 'role' },
 * ]);
 *
 */
export const createAccountColumn = (
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList();

  return applyColumnConfigs(columnList, config);
};
