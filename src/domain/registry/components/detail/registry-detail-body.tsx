"use client";

import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import type { TableProps } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryTagColumn } from "@/domain/registry/components/detail/create-registry-tag-column";
import { RegistryDetailFilter } from "@/domain/registry/components/detail/registry-detail-filter";
import { RegistryDetailFooter } from "@/domain/registry/components/detail/registry-detail-footer";
import { RegistryImageInfoPanel } from "@/domain/registry/components/detail/registry-image-info-panel";
import { RegistryTagRow } from "@/domain/registry/components/detail/registry-tag-row";
import type { RegistryTagSortState } from "@/domain/registry/constants/registry-detail.constant";
import { REGISTRY_TAG_SORT_FIELDS } from "@/domain/registry/constants/registry-detail.constant";
import { useGetRegistryDetailByMode } from "@/domain/registry/hooks/use-get-registry-detail-by-mode";
import {
  registryTagCheckedListAtom,
  registryTagSortAtom,
} from "@/domain/registry/state/registry-detail.atom";
import type { RegistryMode } from "@/domain/registry/types/registry.type";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { checkIsUser, getSessionAccountId } from "@/shared/utils/auth.util";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import {
  ListPageBody,
  ListWrapper,
} from "@/styles/layers/list-page-layers.styled";

/**
 * mode에 따른 태그 컬럼 설정 생성
 * - private: creatorName 제외 (7개 컬럼)
 * - public: creatorName 포함 (8개 컬럼)
 */
const getTagColumnConfig = (
  mode: RegistryMode,
  sort: RegistryTagSortState,
): CoreCreateColumnConfig[] => {
  const baseColumns: CoreCreateColumnConfig[] = [
    {
      key: "imageTagName",
      width: mode === "private" ? "14%" : "12%",
      ellipsis: true,
    },
    { key: "imageTagSizeByte", width: mode === "private" ? "10%" : "9%" },
    { key: "scanStatus", width: mode === "private" ? "12%" : "10%" },
  ];

  // public 모드에서만 creatorName 추가
  if (mode === "public") {
    baseColumns.push({ key: "creatorName", width: "10%" });
  }

  // 나머지 컬럼 추가
  baseColumns.push(
    {
      key: "createdAt",
      align: "left",
      width: mode === "private" ? "14%" : "12%",
      sorter: true,
      sortOrder: getColumnSortOrder(sort, "createdAt"),
    },
    { key: "approvalStatus", width: mode === "private" ? "12%" : "10%" },
    { key: "useRequest", width: mode === "private" ? "12%" : "10%" },
    { key: "scanAction", width: mode === "private" ? "12%" : "10%" },
    { key: "decisionReason", width: mode === "private" ? "14%" : "14%" },
  );

  return baseColumns;
};

interface RegistryDetailBodyProps {
  mode: RegistryMode;
  data: ImageTagListResponse[];
  totalSize: number;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 레지스트리 이미지 상세 Body 컴포넌트
 *
 * 이미지 기본 정보 패널과 태그 목록 테이블을 포함합니다.
 */
export function RegistryDetailBody({
  mode,
  data,
  totalSize,
  isLoading,
  isError,
}: RegistryDetailBodyProps) {
  const { data: session } = useSession();
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";

  const isUser = checkIsUser(session);
  const sessionAccountId = getSessionAccountId(session);

  const { data: imageDetail } = useGetRegistryDetailByMode(
    mode,
    { harborImageName },
    { query: { enabled: !!harborImageName } },
  );

  const [checkedList, setCheckedList] = useAtom(registryTagCheckedListAtom);
  const [sort, setSort] = useAtom(registryTagSortAtom);
  const { rowSelection } = useTableSelection<ImageTagListResponse>(
    checkedList,
    setCheckedList,
  );

  const rowSelectionWithDisabled: TableProps<ImageTagListResponse>["rowSelection"] =
    {
      ...rowSelection,
      getCheckboxProps: (record: ImageTagListResponse) => ({
        disabled: !session || (isUser && record.creatorId !== sessionAccountId),
      }),
    };

  const handleChange: TableProps<ImageTagListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(sorter, REGISTRY_TAG_SORT_FIELDS);
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <Container>
      {/* 이미지 기본 정보 패널 */}
      <RegistryImageInfoPanel
        mode={mode}
        harborImageName={harborImageName}
        data={imageDetail}
      />

      {/* 태그 목록 필터 */}
      <RegistryDetailFilter totalSize={totalSize} loading={isLoading} />

      {/* 태그 목록 테이블 */}
      <ListWrapper>
        <CustomizedTable
          columns={createRegistryTagColumn(getTagColumnConfig(mode, sort))}
          data={data}
          columnHeight={34}
          loading={isLoading}
          isError={isError}
          rowKey="harborTagId"
          tableLayout="fixed"
          scroll={{ x: "100%", y: "100%" }}
          rowSelection={rowSelectionWithDisabled}
          onChange={handleChange}
          customRow={RegistryTagRow}
        />
      </ListWrapper>

      {/* 페이지네이션 및 삭제 버튼 */}
      <RegistryDetailFooter totalSize={totalSize} isLoading={isLoading} />
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled(ListPageBody)`
  padding-top: 24px;
  min-height: 792px;
`;
