"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

import { ReportFilter } from "@/domain/report/components/report-filter";
import { ResourceUsageCards } from "@/domain/report/components/resource-usage-cards";
import {
  REPORT_DATE_TYPE_TEXT,
  REPORT_TYPE_TEXT,
} from "@/domain/report/constants/report.constant";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";

export function ClusterReportMain() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetReportDetail(params.id);

  if (isLoading) {
    return <LoadingWrapper>로딩 중...</LoadingWrapper>;
  }

  if (isError || !data) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  const { resourceUsage, reportDateType, reportType } = data;

  const reportTitle = `${REPORT_DATE_TYPE_TEXT[reportDateType]} ${REPORT_TYPE_TEXT[reportType]} 리포트`;

  return (
    <>
      <Header>
        <PageTitle>{reportTitle}</PageTitle>
        <ReportFilter />
      </Header>
      <Body>
        <SubTitle>1. 자원 활용 리포트 사용 정보</SubTitle>
        <ResourceUsageCards
          resourceUsage={resourceUsage}
          reportDateType={reportDateType}
        />
      </Body>
    </>
  );
}

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const PageTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled.h4`
  font-weight: 700;
  font-size: 15px;
  line-height: 16px;
  margin-bottom: 16px;
`;
