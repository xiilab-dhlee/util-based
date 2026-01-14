"use client";

import { useAtom } from "jotai";
import type { TableProps } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createPrivateRegistryTagColumn } from "@/domain/private-registry/components/detail/create-private-registry-tag-column";
import type { PrivateRegistryTagSortField } from "@/domain/private-registry/constants/private-registry-tag.constant";
import {
  privateRegistryTagCheckedListAtom,
  privateRegistryTagSortAtom,
} from "@/domain/private-registry/state/private-registry-tag.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";

interface PrivateRegistryDetailBodyProps {
  data: ImageTagListResponse[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * 프라이빗 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 *
 * 프라이빗 레지스트리 이미지 태그 목록을 표시하는 테이블을 제공합니다.
 *
 * @returns 프라이빗 레지스트리 이미지 태그 목록 페이지 본문 컴포넌트
 */
export function PrivateRegistryDetailBody({
  data,
  isLoading,
  isError,
}: PrivateRegistryDetailBodyProps) {
  const [checkedList, setCheckedList] = useAtom(
    privateRegistryTagCheckedListAtom,
  );
  const [sort, setSort] = useAtom(privateRegistryTagSortAtom);
  const { rowSelection } = useTableSelection<ImageTagListResponse>(
    checkedList,
    setCheckedList,
  );

  const handleChange: TableProps<ImageTagListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter);
    if (!parsed.field || !parsed.order) return;

    setSort({
      field: parsed.field as PrivateRegistryTagSortField,
      order: parsed.order,
    });
  };

  return (
    <ListWrapper>
      <CustomizedTable
        columns={createPrivateRegistryTagColumn([
          { dataIndex: "imageTagName", ellipsis: true },
          {
            dataIndex: "imageTagSizeByte",
          },
          { dataIndex: "scanStatus" },
          {
            dataIndex: "vulnerability",
          },
          { dataIndex: "creatorName" },
          {
            dataIndex: "createDateTime",
            title: "생성날짜",
            align: "left",
            sorter: true,
            sortOrder: getColumnSortOrder(sort, "createdAt"),
          },
          {
            dataIndex: "latestVulnerabilityScanDateTime",
            align: "left",
            sorter: true,
            sortOrder: getColumnSortOrder(
              sort,
              "latestVulnerabilityScanDateTime",
            ),
          },
          {
            dataIndex: "approvalStatus",
          },
          {
            dataIndex: "requestReason",
          },
          {
            dataIndex: "decisionReason",
          },
        ])}
        activePadding
        data={data}
        columnHeight={34}
        loading={isLoading}
        isError={isError}
        rowKey="harborArtifactId"
        rowSelection={rowSelection}
        onChange={handleChange}
      />
    </ListWrapper>
  );
}
