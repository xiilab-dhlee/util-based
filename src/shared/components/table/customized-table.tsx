"use client";

import { ConfigProvider } from "antd";
import type { ComponentType, HTMLAttributes } from "react";
import styled, { css } from "styled-components";
import {
  type ResponsiveColumnType,
  Table,
  type TableProps,
  theme as themeX,
} from "xiilab-ui";

import { customScrollbar } from "@/styles/mixins/scrollbar";
import { withRowData } from "../hoc/with-row-data";

/**
 * CustomizedTable 컴포넌트의 props 인터페이스
 * @template TRecord - 테이블 데이터의 타입 (기본값: Record<string, unknown>)
 */
interface CustomizedTableProps<
  TRecord extends Record<string, unknown> = Record<string, unknown>,
> extends Omit<TableProps<TRecord>, "columns" | "dataSource"> {
  /** 테이블 컬럼 정의 */
  columns: ResponsiveColumnType<TRecord>[];
  /** 테이블에 표시할 데이터 배열 */
  data: TRecord[];
  /** 테이블 헤더 배경색 (기본값: "#F3F5F7") */
  headerBgColor?: string;
  /** 테이블 헤더 텍스트 색상 (기본값: "#070913") */
  headerTextColor?: string;
  /** 테이블 헤더 폰트 크기 (기본값: 11) */
  headerFontSize?: number;
  /** 테이블 헤더 폰트 두께 (기본값: 600) */
  headerFontWeight?: number;
  /** 테이블 바디 폰트 크기 (기본값: 12) */
  bodyFontSize?: number;
  /** 테이블 바디 폰트 두께 (기본값: 400) */
  bodyFontWeight?: number;
  /** 테이블 바디 배경색 (기본값: "#F8F8FC") */
  bodyBgColor?: string;
  /** 테이블 바디 텍스트 색상 (기본값: "#17171F") */
  bodyTextColor?: string;
  /** 테이블 컬럼 높이 (기본값: 32) */
  columnHeight?: number;
  /** 테이블 헤더 높이 (기본값: 32) */
  headerHeight?: number;
  /** 테이블 컬럼 구분선 숨기기 여부 (기본값: false) */
  hideBorder?: boolean;
  /** 테이블 컬럼 내 여백 추가 여부 (기본값: false) */
  activePadding?: boolean;
  /** 테이블 컬럼 행 컴포넌트 (기본값: undefined) */
  customRow?: ComponentType<
    HTMLAttributes<HTMLTableRowElement> & { rowData: TRecord }
  >;
  /** 테이블 컬럼 행 클릭 핸들러 (기본값: undefined) */
  onRowClick?: (record: TRecord) => void;
}

/**
 * 재사용 가능한 테이블 컴포넌트
 *
 * Ant Design의 Table을 래핑하여 일관된 테이블 스타일과 동작을 제공합니다.
 * 클라이언트 사이드에서만 렌더링되어 하이드레이션 문제를 방지합니다.
 *
 * @description
 * - 테이블 헤더와 바디의 색상, 폰트 크기, 폰트 두께를 커스터마이징할 수 있습니다.
 * - 컬럼 높이를 조정하여 테이블의 전체 높이를 제어할 수 있습니다.
 * - 테이블 컬럼 구분선을 숨기거나 여백을 추가할 수 있습니다.
 * - 스크롤이 가능하며, 데이터가 없을 때 한글 메시지를 표시합니다.
 * - 모든 셀의 텍스트가 중앙 정렬되도록 설정되어 있습니다.
 * - 클라이언트 사이드에서만 렌더링되어 SSR/SSG 호환성을 보장합니다.
 *
 * @features
 * - 반응형 디자인: 테이블이 컨테이너 크기에 맞게 조정됩니다.
 * - 커스터마이징 가능: 헤더/바디 색상, 폰트, 높이 등을 props로 제어할 수 있습니다.
 * - 스크롤 지원: 가로/세로 스크롤이 가능하며 커스텀 스크롤바를 사용합니다.
 * - 일관된 스타일: 프로젝트 전체에서 일관된 테이블 스타일을 제공합니다.
 * - 클라이언트 사이드 렌더링: 하이드레이션 문제를 방지하고 브라우저 환경에서 안정적으로 동작합니다.
 *
 * @template TRecord - 테이블 데이터의 타입
 *
 * @example
 * ```tsx
 * interface Workload {
 *   id: string;
 *   name: string;
 *   status: string;
 * }
 *
 * <CustomizedTable<Workload>
 *   columns={columns}
 *   data={workloads}
 *   headerBgColor="#F3F5F7"
 *   bodyBgColor="#F8F8FC"
 *   columnHeight={40}
 *   hideBorder={true}
 * />
 * ```
 */
export function CustomizedTable<
  TRecord extends Record<string, unknown> = Record<string, unknown>,
>({
  columns,
  data,
  headerBgColor = "#F3F5F7",
  headerTextColor = "#070913",
  bodyBgColor = "#F8F8FC",
  bodyTextColor = "#17171F",
  headerFontSize = 11,
  headerFontWeight = 600,
  bodyFontSize = 12,
  bodyFontWeight = 400,
  columnHeight = 32,
  headerHeight = 32,
  hideBorder = false,
  activePadding = false,
  customRow,
  onRowClick,
  pagination = false,
  darkMode = false,
}: CustomizedTableProps<TRecord>) {
  // Ant Design 테이블 테마 설정
  const theme = {
    components: {
      Table: {
        headerBg: headerBgColor,
        headerSplitColor: headerBgColor,
        headerColor: headerTextColor,
        colorBorderSecondary: "transparent",
        rowSelectedBg: "#fefefe",
        rowSelectedHoverBg: "#fefefe",
        fontWeightStrong: headerFontWeight,
        fontSize: headerFontSize,
        borderColor: "#E1E4E7",
      },
    },
    token: {
      colorBgContainer: bodyBgColor,
      colorText: bodyTextColor,
      fontSize: bodyFontSize,
      fontWeight: bodyFontWeight,
      fontFamily: themeX.fonts.primary,
    },
  };

  // 테이블 지역화 설정 (한글 메시지)
  const locale = {
    emptyText: <>조회된 결과가 없습니다.</>,
  };

  let components: TableProps<TRecord>["components"];
  if (customRow) {
    components = {
      body: {
        row: withRowData<TRecord>(customRow),
      },
    };
  }

  // 클라이언트 사이드가 아닌 경우 로딩 상태 표시
  // if (!isClient) {
  //   return null;
  // }

  return (
    <ConfigProvider theme={theme}>
      <StyledTable
        darkMode={darkMode}
        columns={columns as ResponsiveColumnType<Record<string, unknown>>[]}
        dataSource={data as Record<string, unknown>[]}
        scroll={{ x: "max-content", y: "100%" }}
        pagination={pagination}
        rowKey="id"
        // locale은 테이블의 지역화된 텍스트를 설정하는 속성입니다.
        // 데이터가 없을 때 표시되는 메시지, 페이지네이션 텍스트, 필터 관련 텍스트 등을 커스터마이징할 수 있습니다.
        // 현재는 데이터가 없을 때 '조회된 결과가 없습니다.'라는 한글 메시지를 표시하도록 설정되어 있습니다.
        locale={locale}
        $columnHeight={columnHeight}
        $headerHeight={headerHeight}
        hideBorder={hideBorder}
        activePadding={activePadding}
        components={
          components as TableProps<Record<string, unknown>>["components"]
        }
        onRow={(record: Record<string, unknown>) => {
          const typedRecord = record as TRecord;
          return {
            "data-row": typedRecord, // row 데이터를 props로 전달!
            onClick: () => {
              onRowClick?.(typedRecord);
            },
          };
        }}
      />
    </ConfigProvider>
  );
}

const selectRow = ($darkMode: boolean) => css`
  .ant-table-tbody > tr:not(.ant-table-placeholder).active > td {
    background: ${
      $darkMode
        ? "color-mix(in srgb, var(--color-dark-blue-03) 50%, transparent)"
        : "var(--color-light-blue-10)"
    } !important;
    border-right: none !important;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-top: 1px solid
        ${$darkMode ? "var(--color-light-blue-04)" : "var(--color-blue-04)"};
      border-bottom: 1px solid
        ${$darkMode ? "var(--color-light-blue-04)" : "var(--color-blue-04)"};
      pointer-events: none;
      z-index: 1;
    }

    &:first-child::before {
      border-left: 1px solid
        ${$darkMode ? "var(--color-light-blue-04)" : "var(--color-blue-04)"};
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child::before {
      border-right: 1px solid
        ${$darkMode ? "var(--color-light-blue-04)" : "var(--color-blue-04)"};
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const removeBorder = css`
  & .ant-table-thead > tr > th {
    border-right: none !important;
    border-bottom: none !important;
  }
  & .ant-table-tbody > tr > td {
    border-right: none !important;
    border-bottom: none !important;
  }
`;

const removeBorderRadius = css`
  & .ant-table-header {
    border-radius: 0px !important;
  }
  & .ant-table-thead > tr > th:first-of-type {
    border-top-left-radius: 0px !important;
  }
  & .ant-table-thead .ant-table-cell-scrollbar {
    border-top-right-radius: 0px !important;
  }
`;

const fitHeight = ($columnHeight: number, $headerHeight: number) => css`
  height: 100%;

  & .ant-table-wrapper,
  & .ant-spin-nested-loading,
  & .ant-spin-container {
    height: 100%;
  }
  & .ant-table {
    height: 100%;
  }
  & .ant-table-container {
    height: 100%;
  }
  & .ant-table-body {
    height: calc(100% - ${$columnHeight}px) !important;
    max-height: none !important;
  }
  & .ant-table-thead .ant-table-cell-scrollbar {
    height: ${$headerHeight}px;
    padding: 0;
  }
  & .ant-table-thead > tr > th {
    height: ${$headerHeight}px;
    padding: 0;
  }
  & .ant-table-tbody > tr > td {
    height: ${$columnHeight}px;
    padding: 0;
  }
`;
/* Ant Design 테이블 td 중앙 정렬 */
const addColumnAlign = css`
  & .ant-table thead th {
    text-align: center;
    vertical-align: middle;
  }

  & .ant-table thead th .ant-table-cell {
    text-align: center;
    vertical-align: middle;
  }

  & .ant-table tbody td {
    text-align: center;
    vertical-align: middle;
  }

  & .ant-table tbody td .ant-table-cell {
    text-align: center;
    vertical-align: middle;
  }
`;

const addColumnPadding = css`
  & .ant-table-thead > tr > th {
    padding: 0 12px !important;
  }

  & .ant-table-tbody > tr > td {
    padding: 0 12px;
  }
`;

/**
 * 스타일이 적용된 테이블 컴포넌트
 *
 * CustomizedTable에서 사용하는 스타일드 컴포넌트로,
 * 테이블의 높이, 테두리, 여백 등을 제어합니다.
 */
export const StyledTable = styled(Table)<{
  /** 테이블 컬럼 높이 */
  $columnHeight: number;
  /** 테이블 헤더 높이 */
  $headerHeight: number;
  /** 테이블 컬럼 구분선 숨기기 여부 */
  hideBorder: boolean;
  /** 테이블 컬럼 내 여백 추가 여부 */
  activePadding: boolean;
}>`
  width: 100%;
  // ... 처리 (임시)
  // & .ant-table-tbody > tr > td {
  //   white-space: nowrap;
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  //   max-width: 150px;
  // }
  // 테이블 스크롤 설정
  /* & .ant-table {
    overflow: auto;
  } */
  & .ant-table-body {
    overflow: auto !important;

    ${customScrollbar()}
  }
  // 테이블 페이지네이션 영역 확보
  & .ant-spin-container {
    display: flex;
    flex-direction: column;
  }
  // 테이블 행 호버 시 배경색 변경 (임시)
  // .ant-table-cell-row-hover {
  //   background-color: #f3f3f7 !important;
  // }

  ${({ $columnHeight, $headerHeight }) =>
    fitHeight($columnHeight, $headerHeight)}
  ${removeBorderRadius}
  ${customScrollbar()}
  ${({ hideBorder }) => hideBorder && removeBorder}
  ${({ activePadding }) => activePadding && addColumnPadding}
  ${addColumnAlign}
  // 현재 다크모드 지원X
  ${selectRow(false)}
`;
