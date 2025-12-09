import { Icon, type ResponsiveColumnType } from "xiilab-ui";

import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import {
  ColumnAlignCenterWrap,
  ColumnIconWrap,
} from "@/styles/layers/column-layer.styled";

/**
 * 멤버 행 타입
 */
export interface MemberRow extends Record<string, unknown> {
  id: string;
  name: string;
  email?: string;
}

/**
 * 멤버 컬럼 생성 옵션
 */
interface CreateMemberColumnOptions {
  /** 삭제 버튼 클릭 핸들러 (전달 시 삭제 컬럼 표시) */
  onRemove?: (id: string) => void;
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
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "40%",
    },
    {
      title: "이메일",
      dataIndex: "email",
      key: "email",
      align: "left",
      ellipsis: true,
      width: "45%",
    },
  ];

  if (onRemove) {
    columns.push({
      title: "삭제",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      width: "15%",

      render: (_: unknown, record: MemberRow) => (
        <ColumnAlignCenterWrap>
          <ColumnIconWrap onClick={() => onRemove(record.id)} type="button">
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
