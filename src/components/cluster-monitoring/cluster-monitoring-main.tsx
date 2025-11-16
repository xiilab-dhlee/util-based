"use client";

import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { Typography } from "xiilab-ui";

import { ClusterEventCard } from "@/components/cluster-monitoring/cluster-event-card";
import { ClusterEventListFooter } from "@/components/cluster-monitoring/cluster-event-list-footer";
import { ClusterMonitoringAside } from "@/components/cluster-monitoring/cluster-monitoring-aside";
import { ClusterResourceQuotaCard } from "@/components/cluster-monitoring/cluster-resource-quota-card";
import { ViewYamlLogModal } from "@/components/cluster-monitoring/view-yaml-log-modal";
import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "클러스터 모니터링" },
];

export function ClusterMonitoringMain() {
  return (
    <>
      <PageHeader
        title="클러스터 모니터링"
        icon="Monitoring01"
        description="Cluster Monitoring"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <QuotaHeader>
            <Typography.Text variant="title-2">리소스 할당량</Typography.Text>
          </QuotaHeader>
          <QuotaBody>
            <QuotaPane>
              <ClusterResourceQuotaCard
                resourceName="GPU"
                total={100}
                quota={77}
                showDivider
              />
              <ClusterResourceQuotaCard
                resourceName="MIG"
                total={100}
                quota={77}
              />
              <ClusterResourceQuotaCard
                resourceName="MPS"
                total={100}
                quota={77}
              />
            </QuotaPane>
            <QuotaPane>
              <ClusterResourceQuotaCard
                resourceName="CPU"
                total={100}
                quota={77}
              />
              <ClusterResourceQuotaCard
                resourceName="MEM"
                total={100}
                quota={77}
              />
              <ClusterResourceQuotaCard
                resourceName="DISK"
                total={100}
                quota={77}
              />
            </QuotaPane>
          </QuotaBody>
          <EventHeader>
            <EventTitle variant="title-2">전체 클러스터 이벤트 내역</EventTitle>
          </EventHeader>
          <EventBody>
            <EventGridWrapper>
              {Array.from({ length: 10 }).map((_) => (
                <ClusterEventCard key={uuidv4()} />
              ))}
            </EventGridWrapper>

            <ClusterEventListFooter />
          </EventBody>
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={620}>
          <ClusterMonitoringAside />
        </ListPageAside>
      </ListPageMain>
      {/* YAML 로그 모달 */}
      <ViewYamlLogModal />
    </>
  );
}

const QuotaBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
`;

const QuotaHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const QuotaPane = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border: 1px solid #e0e0e0;
  background-color: #f7f9fb;
  border-radius: 4px;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const EventTitle = styled(Typography.Text)`
  ${subTitleStyle(5)}

  margin-left: 5px;
`;

const EventBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
  padding: 20px;
`;

const EventGridWrapper = styled.div`
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  border-radius: 4px;
  background-color: #fcfcfc;
`;
