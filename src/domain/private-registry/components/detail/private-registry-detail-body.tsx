"use client";

import { useAtom, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import styled from "styled-components";
import { Button, Icon, type TableProps } from "xiilab-ui";

import type { ImageTagListResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetPrivateImageDetail } from "@/api/generated/private-registry/private-registry";
import { createPrivateRegistryTagColumn } from "@/domain/private-registry/components/detail/create-private-registry-tag-column";
import { PrivateRegistryDetailFilter } from "@/domain/private-registry/components/detail/private-registry-detail-filter";
import { PrivateRegistryDetailFooter } from "@/domain/private-registry/components/detail/private-registry-detail-footer";
import { PrivateRegistryTagRow } from "@/domain/private-registry/components/detail/private-registry-tag-row";
import { PRIVATE_REGISTRY_TAG_SORT_FIELDS } from "@/domain/private-registry/constants/private-registry-tag.constant";
import {
  privateRegistryTagCheckedListAtom,
  privateRegistryTagSelectedAtom,
  privateRegistryTagSortAtom,
} from "@/domain/private-registry/state/private-registry-tag.atom";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { PRIVATE_REGISTRY_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { useTableSelection } from "@/shared/hooks/use-table-selection";
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

interface PrivateRegistryDetailBodyProps {
  data: ImageTagListResponse[];
  totalSize: number;
  isLoading: boolean;
  isError: boolean;
}

/**
 * 프라이빗 레지스트리 이미지 상세 Body 컴포넌트
 *
 * 이미지 기본 정보 패널과 태그 목록 테이블을 포함합니다.
 */
export function PrivateRegistryDetailBody({
  data,
  totalSize,
  isLoading,
  isError,
}: PrivateRegistryDetailBodyProps) {
  const { name } = useParams<{ name: string }>();
  const harborImageName = name ? decodeURIComponent(name) : "";
  const publish = usePublish();

  const { data: imageDetail } = useGetPrivateImageDetail(
    { harborImageName },
    { query: { enabled: !!harborImageName } },
  );

  const [checkedList, setCheckedList] = useAtom(
    privateRegistryTagCheckedListAtom,
  );
  const [sort, setSort] = useAtom(privateRegistryTagSortAtom);
  const setSelectedTag = useSetAtom(privateRegistryTagSelectedAtom);
  const { rowSelection } = useTableSelection<ImageTagListResponse>(
    checkedList,
    setCheckedList,
  );

  // 데이터 변경 시 첫 번째 태그 자동 선택
  useEffect(() => {
    if (data.length > 0) {
      setSelectedTag(data[0]);
    }
  }, [data, setSelectedTag]);

  const handleDelete = () => {
    publish(PRIVATE_REGISTRY_EVENTS.openDeleteModal, [harborImageName]);
  };

  const handleChange: TableProps<ImageTagListResponse>["onChange"] = (
    _,
    __,
    sorter,
  ) => {
    const parsed = parseSorterToAntdState(
      sorter,
      PRIVATE_REGISTRY_TAG_SORT_FIELDS,
    );
    if (!parsed.field || !parsed.order) return;

    setSort(parsed);
  };

  return (
    <Container>
      {/* 이미지 기본 정보 헤더 */}
      <Header>
        <ListSectionTitle>컨테이너 이미지 기본 정보</ListSectionTitle>
        <Button
          width={80}
          size="small"
          variant="outlined"
          onClick={handleDelete}
          height={34}
        >
          이미지 삭제
        </Button>
      </Header>

      {/* 이미지 기본 정보 패널 */}
      <InfoPanel>
        <Pane>
          <Record>
            <IconWrapper>
              <Icon name="Workspace02" color="var(--icon-fill)" size={20} />
            </IconWrapper>
            <Key>이름 :</Key>
            <Value>{imageDetail?.imageDisplayName || "-"}</Value>
          </Record>
          <Record>
            <IconWrapper>
              <Icon name="Person" color="var(--icon-fill)" size={16} />
            </IconWrapper>
            <Key>생성자 :</Key>
            <Value>{imageDetail?.creatorName || "-"}</Value>
          </Record>
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
      <PrivateRegistryDetailFilter totalSize={totalSize} loading={isLoading} />

      {/* 태그 목록 테이블 */}
      <ListWrapper>
        <CustomizedTable
          columns={createPrivateRegistryTagColumn([
            { key: "imageTagName", ellipsis: true },
            { key: "imageTagSizeByte" },
            { key: "scanStatus" },
            { key: "vulnerability" },
            { key: "creatorName" },
            {
              key: "updatedAt",
              title: "수정일자",
              align: "left",
              sorter: true,
              sortOrder: getColumnSortOrder(sort, "updatedAt"),
            },
            {
              key: "latestVulnerabilityScanDateTime",
              align: "left",
              sorter: true,
              sortOrder: getColumnSortOrder(
                sort,
                "latestVulnerabilityScanDateTime",
              ),
            },
            { key: "approvalStatus" },
            { key: "requestReason" },
            { key: "decisionReason" },
          ])}
          activePadding
          data={data}
          columnHeight={34}
          loading={isLoading}
          isError={isError}
          rowKey="harborArtifactId"
          rowSelection={rowSelection}
          onChange={handleChange}
          customRow={PrivateRegistryTagRow}
        />
      </ListWrapper>

      {/* 페이지네이션 및 삭제 버튼 */}
      <PrivateRegistryDetailFooter
        totalSize={totalSize}
        isLoading={isLoading}
      />
    </Container>
  );
}

// ============================================================================
// Styled Components
// ============================================================================

const Container = styled(ListPageBody)``;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
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
