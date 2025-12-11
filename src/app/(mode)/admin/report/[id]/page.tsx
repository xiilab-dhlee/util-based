"use client";

import { Spin } from "antd";
import { useParams } from "next/navigation";
import styled from "styled-components";

import {
  ClusterReportMain,
  SystemReportMain,
} from "@/domain/report/components/main";
import { REPORT_TYPE } from "@/domain/report/constants/report.constant";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";

export default function AdminReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useGetReportDetail(params.id);

  if (isLoading) {
    return (
      <FullPageCenter>
        <Spin size="default" />
      </FullPageCenter>
    );
  }

  if (isError || !data) {
    return (
      <FullPageCenter>
        <DataErrorState
          title="리포트 데이터를 불러올 수 없습니다."
          onRetry={refetch}
        />
      </FullPageCenter>
    );
  }

  return data?.reportType === REPORT_TYPE.SYSTEM ? (
    <SystemReportMain report={data} />
  ) : (
    <ClusterReportMain report={data} />
  );
}

const FullPageCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
