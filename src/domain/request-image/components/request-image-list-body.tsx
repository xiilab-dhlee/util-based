"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { ImageTagUsageRequestResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  REQUEST_IMAGE_SORT_FIELDS,
  type RequestImageSortState,
} from "@/domain/request-image/constants/request-image.constant";
import { requestImageSortAtom } from "@/domain/request-image/state/request-image.atom";
import { createRequestImageColumn } from "@/shared/components/column/create-request-image-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

/**
 * sort 상태에 따른 컬럼 설정 생성
 */
const getColumnConfig = (sort: RequestImageSortState) => [
  {
    key: "imageDisplayName" as const,
    width: "14%",
    sorter: true,
    sortOrder: getColumnSortOrder(sort, "imageDisplayName"),
    ellipsis: true,
  },
  { key: "workspaceName" as const, width: "10%" },
  {
    key: "imageTagName" as const,
    width: "10%",
    sorter: true,
    sortOrder: getColumnSortOrder(sort, "imageTagName"),
    ellipsis: true,
  },
  { key: "vulnerability" as const, width: "10%" },
  { key: "requestReason" as const, width: "8%" },
  { key: "approvalStatus" as const, width: "8%" },
  { key: "decisionReason" as const, width: "10%" },
  {
    key: "creatorName" as const,
    width: "8%",
    sorter: true,
    sortOrder: getColumnSortOrder(sort, "creatorName"),
  },
  {
    key: "requestedAt" as const,
    width: "12%",
    sorter: true,
    sortOrder: getColumnSortOrder(sort, "requestedAt"),
  },
  { key: "reject" as const, width: "5%" },
  { key: "approve" as const, width: "5%" },
];

interface RequestImageListBodyProps {
  content: ImageTagUsageRequestResponse[];
  loading: boolean;
  isError?: boolean;
}

/**
 * 이미지 요청 목록 페이지 본문 컴포넌트
 *
 * 이미지 요청 목록 페이지에서 이미지 요청 목록을 표시하는 테이블을 제공합니다.
 *
 * @param content - 이미지 요청 목록 데이터
 * @param loading - 로딩 여부
 * @param isError - 에러 상태 여부
 * @returns 이미지 요청 목록 페이지 본문 컴포넌트
 */
export function RequestImageListBody({
  content,
  loading,
  isError = false,
}: RequestImageListBodyProps) {
  const [sort, setSort] = useAtom(requestImageSortAtom);

  const handleChange: TableProps<ImageTagUsageRequestResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, REQUEST_IMAGE_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createRequestImageColumn(getColumnConfig(sort))}
        data={content}
        activePadding
        columnHeight={40}
        loading={loading}
        isError={isError}
        onChange={handleChange}
        tableLayout="fixed"
        scroll={{ x: "100%", y: "100%" }}
      />
    </ListWrapper>
  );
}
