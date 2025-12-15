"use client";

import { useAtom, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Button, Dropdown } from "xiilab-ui";

import {
  REPORT_DATE_TYPE_OPTIONS,
  REPORT_TYPE_OPTIONS,
} from "@/domain/report/constants/report.constant";
import type {
  ReportDateType,
  ReportListType,
  ReportType,
} from "@/domain/report/schemas/report.schema";
import {
  openCreateReportModalAtom,
  reportDateTypeAtom,
  reportPageAtom,
  reportTypeAtom,
} from "@/domain/report/state/report.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { CoreListResponse } from "@/shared/types/core.model";

interface ReportListFilterProps {
  data?: CoreListResponse<ReportListType>;
}

/**
 * 리포트 목록 페이지 상단 필터 컴포넌트
 *
 * 리포트 타입(주간/월간), 리포트 종류(시스템/클러스터) 필터와 리포트 생성 버튼을 제공합니다.
 *
 * @returns 리포트 목록 페이지 상단 필터 컴포넌트
 */
export function ReportListFilter({ data }: ReportListFilterProps) {
  const [reportDateType, setReportDateType] = useAtom(reportDateTypeAtom);
  const [reportType, setReportType] = useAtom(reportTypeAtom);
  const setOpenCreateModal = useSetAtom(openCreateReportModalAtom);
  const resetPage = useResetAtom(reportPageAtom);

  /**
   * 리포트 타입 변경 핸들러
   * 리포트 타입 변경 시 페이지를 초기화
   */
  const handleDateTypeChange = (value: ReportDateType | null) => {
    resetPage();
    setReportDateType(value ?? undefined);
  };

  /**
   * 리포트 종류 변경 핸들러
   * 리포트 종류 변경 시 페이지를 초기화
   */
  const handleTypeChange = (value: ReportType | null) => {
    resetPage();
    setReportType(value ?? undefined);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  return (
    <MySearchFilter title="리포트 목록" total={data?.totalSize}>
      {/* 리포트 타입 드롭다운 */}
      <Dropdown
        options={[ALL_OPTION, ...REPORT_DATE_TYPE_OPTIONS]}
        placeholder="리포트 타입"
        onChange={handleDateTypeChange}
        value={reportDateType}
        width={150}
        height={30}
      />

      {/* 리포트 종류 드롭다운 */}
      <Dropdown
        options={[ALL_OPTION, ...REPORT_TYPE_OPTIONS]}
        placeholder="리포트 종류"
        onChange={handleTypeChange}
        value={reportType}
        width={120}
        height={30}
      />

      {/* 리포트 생성하기 버튼 */}
      <Button
        color="primary"
        icon="Information"
        iconPosition="left"
        variant="gradient"
        width={120}
        height={30}
        onClick={handleOpenCreateModal}
      >
        리포트 생성
      </Button>
    </MySearchFilter>
  );
}
