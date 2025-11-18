"use client";

import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import { Button } from "xiilab-ui";

import { ListSectionTitle } from "@/styles/layers/list-page-layers.styled";

export function ReportFilter() {
  const searchParams = useSearchParams();

  const reportType = searchParams.get("reportType");

  let title = "";
  if (reportType === "MONTHLY_SYSTEM") {
    title = "월간 시스템 리포트";
  } else if (reportType === "WEEKLY_SYSTEM") {
    title = "주간 시스템 리포트";
  } else if (reportType === "MONTHLY_CLUSTER") {
    title = "월간 클러스터 리포트";
  } else if (reportType === "WEEKLY_CLUSTER") {
    title = "주간 클러스터 리포트";
  }

  const handlePdf = () => {
    alert("PDF 저장");
  };
  return (
    <Container>
      <ListSectionTitle>{title}</ListSectionTitle>
      <Button
        color="primary"
        icon="Download"
        iconPosition="left"
        variant="gradient"
        width={120}
        height={30}
        onClick={handlePdf}
      >
        PDF 저장
      </Button>
    </Container>
  );
}

const Container = styled.div`
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 14px;
  height: auto;
`;
