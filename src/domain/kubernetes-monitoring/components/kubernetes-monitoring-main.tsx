"use client";

import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import {
  kubernetesResourceKeywordAtom,
  kubernetesResourcePageAtom,
  kubernetesResourceStatusAtom,
  kubernetesSelectedResourceNameAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { KubernetesEventCard } from "@/domain/kubernetes-monitoring/components/kubernetes-event-card";
import { KubernetesEventListFooter } from "@/domain/kubernetes-monitoring/components/kubernetes-event-list-footer";
import { KubernetesMonitoringAside } from "@/domain/kubernetes-monitoring/components/kubernetes-monitoring-aside";
import { KubernetesResourceQuotaCard } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-quota-card";
import { ViewDescribeModal } from "@/domain/kubernetes-monitoring/components/view-describe-modal";
import { ViewKubernetesEventDetailModal } from "@/domain/kubernetes-monitoring/components/view-kubernetes-event-detail-modal";
import { ViewYamlLogModal } from "@/domain/kubernetes-monitoring/components/view-yaml-log-modal";
import type { KubernetesEventType } from "@/domain/kubernetes-monitoring/types/kubernetes-monitoring.type";
import { PageHeader } from "@/shared/components/layouts/page-header";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";

export function KubernetesMonitoringMain() {
  const resetPage = useResetAtom(kubernetesResourcePageAtom);
  const resetKeyword = useResetAtom(kubernetesResourceKeywordAtom);
  const resetStatus = useResetAtom(kubernetesResourceStatusAtom);
  const resetSelectedResourceName = useResetAtom(
    kubernetesSelectedResourceNameAtom,
  );

  useEffect(() => {
    return () => {
      resetPage();
      resetKeyword();
      resetStatus();
      resetSelectedResourceName();
    };
  }, [resetKeyword, resetPage, resetSelectedResourceName, resetStatus]);

  // TODO: API 연동 후 실제 데이터로 교체
  const mockEvents: KubernetesEventType[] = Array.from({ length: 12 }).map(
    (_, index) => ({
      eventId: `event-${index}`,
      namespace: `네임스페이스${String(index + 1).padStart(2, "0")}`,
      status:
        index % 3 === 0 ? "error" : index % 3 === 1 ? "warning" : "normal",
      object: `파드:pod-${index + 100}`,
      ipAddress: `10.02.4.${121 + index}`,
      message: `Pod nginx-deployment-5d4d5678b7-abcde가 CrashLoopBackOff 상태입니다. 컨테이너가 반복적으로 실패하고 있습니다.`,
      dateTime: new Date(Date.now() - index * 1000 * 60 * 60).toISOString(),
    }),
  );

  return (
    <>
      <PageHeader
        pageKey="admin.kubernetes-monitoring"
        description="Kubernetes Monitoring"
      />
      {/* 소스코드 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 소스코드 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          <QuotaHeader>
            <Typography.Text variant="title-2">리소스 할당량</Typography.Text>
          </QuotaHeader>
          <QuotaBody>
            <QuotaPane>
              <KubernetesResourceQuotaCard
                resourceName="GPU"
                total={100}
                quota={77}
                showDivider
              />
              <KubernetesResourceQuotaCard
                resourceName="MIG"
                total={100}
                quota={77}
              />
              <KubernetesResourceQuotaCard
                resourceName="MPS"
                total={100}
                quota={77}
              />
            </QuotaPane>
            <QuotaPane>
              <KubernetesResourceQuotaCard
                resourceName="CPU"
                total={100}
                quota={77}
              />
              <KubernetesResourceQuotaCard
                resourceName="MEM"
                total={100}
                quota={77}
              />
              <KubernetesResourceQuotaCard
                resourceName="DISK"
                total={100}
                quota={77}
              />
            </QuotaPane>
          </QuotaBody>
          <EventHeader>
            <EventTitle variant="title-2">
              전체 쿠버네티스 이벤트 내역
            </EventTitle>
          </EventHeader>
          <EventBody>
            <EventGridWrapper>
              {mockEvents.map((event) => (
                <KubernetesEventCard key={event.eventId} event={event} />
              ))}
            </EventGridWrapper>

            <KubernetesEventListFooter />
          </EventBody>
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={620}>
          <KubernetesMonitoringAside />
        </ListPageAside>
      </ListPageMain>
      {/* YAML 로그 모달 */}
      <ViewYamlLogModal />
      {/* 쿠버네티스 Describe 모달 */}
      <ViewDescribeModal />
      {/* 쿠버네티스 이벤트 상세 모달 */}
      <ViewKubernetesEventDetailModal />
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
