"use client";

import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Button, Icon, type TableProps } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { createRegistryTagColumn } from "@/domain/registry/components/detail/create-registry-tag-column";
import { RegistryDetailFilter } from "@/domain/registry/components/detail/registry-detail-filter";
import { RegistryDetailFooter } from "@/domain/registry/components/detail/registry-detail-footer";
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
import { REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
import type { CoreCreateColumnConfig } from "@/shared/types/core.model";
import { checkIsUser, getSessionAccountId } from "@/shared/utils/auth.util";
import { formatDateSafely } from "@/shared/utils/date.util";
import {
  getColumnSortOrder,
  parseSorterToAntdState,
} from "@/shared/utils/sort.util";
import {
  ListPageBody,
  ListSectionTitle,
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
      width: mode === "private" ? "18%" : "16%",
      ellipsis: true,
    },
    { key: "imageTagSizeByte", width: mode === "private" ? "12%" : "10%" },
    { key: "scanStatus", width: mode === "private" ? "14%" : "12%" },
  ];

  // public 모드에서만 creatorName 추가
  if (mode === "public") {
    baseColumns.push({ key: "creatorName", width: "12%" });
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
    { key: "approvalStatus", width: mode === "private" ? "14%" : "12%" },
    { key: "useRequest", width: mode === "private" ? "14%" : "12%" },
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
  const publish = usePublish();

  const { data: imageDetail } = useGetRegistryDetailByMode(
    mode,
    { request: { harborImageName } },
    { query: { enabled: !!harborImageName } },
  );

  const isUser = checkIsUser(session);
  const sessionAccountId = getSessionAccountId(session);
  const isOwner = imageDetail?.creatorId === sessionAccountId;
  const canDelete = !isUser || isOwner;

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
        disabled: isUser && record.creatorId !== sessionAccountId,
      }),
    };

  const handleDelete = () => {
    publish(REGISTRY_EVENTS.openDeleteModal, [harborImageName]);
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
      {/* 이미지 기본 정보 헤더 */}
      <Header>
        <ListSectionTitle>컨테이너 이미지 기본 정보</ListSectionTitle>
        {canDelete && (
          <Button
            width={80}
            size="small"
            variant="outlined"
            onClick={handleDelete}
            height={34}
          >
            이미지 삭제
          </Button>
        )}
      </Header>

      {/* 이미지 기본 정보 패널 */}
      <InfoPanel>
        <Pane>
          <Record>
            <IconWrapper>
              <Icon name="Information" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>구분 :</Key>
            <Value>-</Value>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Information" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>이름 :</Key>
            <Value>{imageDetail?.imageDisplayName || "-"}</Value>
          </Record>
          {mode === "public" && (
            <Record>
              <IconWrapper>
                <Icon name="Person" color="var(--icon-fill)" size={16} />
              </IconWrapper>
              <Key>생성자 :</Key>
              <Value>{imageDetail?.creatorName || "-"}</Value>
            </Record>
          )}
          <Record>
            <IconWrapper>
              <Icon name="Calendar" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>생성일 :</Key>
            <Value>{formatDateSafely(imageDetail?.createdAt)}</Value>
          </Record>
        </Pane>
      </InfoPanel>

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
          rowKey="imageTagId"
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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const InfoPanel = styled.div`
  border: 1px solid #E0E0E0;
  background-color: #f7f9fb;
  padding: 10px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 38px;
  border-radius: 4px;
`;

const Pane = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  & + & {
    border-left: 1px solid #e0e0e0;
    margin-left: 10px;
    padding-left: 10px;
  }
`;

const Record = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 11px;

  & + & {
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
    margin-top: 10px;
  }
`;

const IconWrapper = styled.div`
  border: 1px solid #d1d5dc;
  border-radius: 2px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;

  --icon-fill: #000;
`;

const Key = styled.span`
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: #000;
`;

const Value = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #000;
`;
