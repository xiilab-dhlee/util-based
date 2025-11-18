"use client";

import styled from "styled-components";
import { Card } from "xiilab-ui";

import { subTitleStyle } from "@/styles/mixins/text";
import ReportFilter from "./report-filter";

export function ClusterReportMain() {
  return (
    <>
      <ReportFilter />
      <Body>
        <SubTitle>1. 월간 자원 활용 리포트 사용 정보</SubTitle>
        <CartName>2025년 7월 클러스터 자원 활용 정보</CartName>
        <TotalResourceWrapper>
          <Card
            contentVariant="compact"
            actionElement={<span>전체 : 12개</span>}
            title="GPU"
            height={172}
          ></Card>
          <Card
            contentVariant="compact"
            actionElement={<span>전체 : 300Core</span>}
            title="CPU"
            height={172}
          ></Card>
          <Card
            contentVariant="compact"
            actionElement={<span>전체 : 21GB</span>}
            title="MEM"
            height={172}
          ></Card>
          <Card
            contentVariant="compact"
            actionElement={<span>전체 : 21TB</span>}
            title="DISK"
            height={172}
          ></Card>
        </TotalResourceWrapper>
      </Body>
    </>
  );
}

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

const CartName = styled.div`
  ${subTitleStyle(5)}

  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  margin-left: 5px;
  margin-bottom: 14px;
`;

const TotalResourceWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;
