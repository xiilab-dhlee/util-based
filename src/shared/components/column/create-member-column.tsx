import { Icon, type ResponsiveColumnType } from "xiilab-ui";

import type { GroupMemberResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

/**
 * 멤버 컬럼 생성 옵션
 */
interface CreateMemberColumnOptions {
  /** 삭제 버튼 클릭 핸들러 (전달 시 삭제 컬럼 표시) */
  onRemove?: (accountId: string) => void;
}

/**
 * 멤버 테이블 컬럼 정의 생성
 */
const createColumnList = (
  options: CreateMemberColumnOptions = {},
): ResponsiveColumnType[] => {
  const { onRemove } = options;

  const columns: ResponsiveColumnType[] = [
    {
      title: "이름",
      dataIndex: "accountName",
      key: "accountName",
      align: "left",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "이메일",
      key: "email",
      dataIndex: "email",
      align: "left",
      ellipsis: true,
      width: "45%",
    },
  ];

  if (onRemove) {
    columns.push({
      title: "삭제",
      key: "actions",
      align: "center",
      width: "15%",

      render: (_: unknown, record: GroupMemberResponse) => (
        <ColumnAlignCenterWrap>
          <ColumnIconWrap
            onClick={() => onRemove(record.accountId)}
            type="button"
          >
            <Icon name="Delete" color="#000" size={16} />
            <span className="sr-only">멤버 삭제</span>
          </ColumnIconWrap>
        </ColumnAlignCenterWrap>
      ),
    });
  }

  return columns;
};

export const createMemberColumn = (
  options: CreateMemberColumnOptions = {},
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType[] => {
  const columnList = createColumnList(options);

  return applyColumnConfigs(columnList, config);
};
