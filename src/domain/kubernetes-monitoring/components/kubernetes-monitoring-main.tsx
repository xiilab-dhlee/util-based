"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import styled from "styled-components";

import { useGetAllNamespaceEvents } from "@/api/generated/admin-k8s/admin-k8s";
import type { K8sEventResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  kubernetesEventPageAtom,
  kubernetesResourcePageAtom,
  kubernetesResourceSearchTextAtom,
  kubernetesResourceStatusAtom,
  kubernetesSelectedResourceNameAtom,
} from "@/domain/kubernetes-monitoring/atom/kubernetes-monitoring.atom";
import { KubernetesEventCard } from "@/domain/kubernetes-monitoring/components/kubernetes-event-card";
import { KubernetesEventCardSkeleton } from "@/domain/kubernetes-monitoring/components/kubernetes-event-card-skeleton";
import { KubernetesEventListFooter } from "@/domain/kubernetes-monitoring/components/kubernetes-event-list-footer";
import { KubernetesMonitoringAside } from "@/domain/kubernetes-monitoring/components/kubernetes-monitoring-aside";
import { KubernetesResourceQuotaSection } from "@/domain/kubernetes-monitoring/components/kubernetes-resource-quota-section";
import { ViewDescribeModal } from "@/domain/kubernetes-monitoring/components/view-describe-modal";
import { ViewKubernetesEventDetailModal } from "@/domain/kubernetes-monitoring/components/view-kubernetes-event-detail-modal";
import { ViewYamlLogModal } from "@/domain/kubernetes-monitoring/components/view-yaml-log-modal";
import { KUBERNETES_EVENT_LIST_PAGE_SIZE } from "@/domain/kubernetes-monitoring/constants/kubernetes-monitoring.constant";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
  ListSectionTitle,
} from "@/styles/layers/list-page-layers.styled";

export function KubernetesMonitoringMain() {
  const resetPage = useResetAtom(kubernetesResourcePageAtom);
  const resetSearchText = useResetAtom(kubernetesResourceSearchTextAtom);
  const resetStatus = useResetAtom(kubernetesResourceStatusAtom);
  const resetSelectedResourceName = useResetAtom(
    kubernetesSelectedResourceNameAtom,
  );
  const resetEventPage = useResetAtom(kubernetesEventPageAtom);

  const eventPage = useAtomValue(kubernetesEventPageAtom);
  const {
    data: eventsResponse,
    isError,
    isLoading,
  } = useGetAllNamespaceEvents({
    pageNo: eventPage - 1,
    pageSize: KUBERNETES_EVENT_LIST_PAGE_SIZE,
  });

  const events = eventsResponse?.content ?? [];

  const renderEventSkeletonCards = (count: number) => {
    return Array.from({ length: count }).map((_, index: number) => (
      <KubernetesEventCardSkeleton key={`k8s-event-skeleton-${index}`} />
    ));
  };

  const renderEventCards = (items: K8sEventResponse[]) => {
    return items.map((event: K8sEventResponse, index: number) => (
      <KubernetesEventCard
        key={`${event.namespace}-${event.lastObservedAt}-${index}`}
        event={event}
      />
    ));
  };

  const renderEventContent = () => {
    if (isError) {
      return (
        <EventGridWrapper $rows={EVENT_GRID_ROWS}>
          <EventGridStatusWrapper>
            <DataErrorState />
          </EventGridStatusWrapper>
        </EventGridWrapper>
      );
    }

    if (isLoading) {
      return (
        <EventGridWrapper $rows={EVENT_GRID_ROWS}>
          {renderEventSkeletonCards(KUBERNETES_EVENT_LIST_PAGE_SIZE)}
        </EventGridWrapper>
      );
    }

    if (events.length === 0) {
      return (
        <EventGridWrapper $rows={EVENT_GRID_ROWS}>
          <EventGridStatusWrapper>
            <EmptyState />
          </EventGridStatusWrapper>
        </EventGridWrapper>
      );
    }

    return (
      <EventGridWrapper $rows={EVENT_GRID_ROWS}>
        {renderEventCards(events)}
      </EventGridWrapper>
    );
  };

  useEffect(() => {
    return () => {
      resetPage();
      resetSearchText();
      resetStatus();
      resetSelectedResourceName();
      resetEventPage();
    };
  }, [
    resetSearchText,
    resetPage,
    resetSelectedResourceName,
    resetStatus,
    resetEventPage,
  ]);

  return (
    <>
      <PageHeader
        pageKey="admin.kubernetes-monitoring"
        description="Kubernetes Monitoring"
      />

      <ListPageMain>
        <ListPageBody>
          <QuotaSectionTitle>리소스 할당량</QuotaSectionTitle>
          <KubernetesResourceQuotaSection />
          <ListSectionTitle>전체 쿠버네티스 이벤트 내역</ListSectionTitle>
          <EventBody>
            {renderEventContent()}
            <KubernetesEventListFooter
              total={eventsResponse?.totalSize ?? 0}
              isLoading={isLoading}
            />
          </EventBody>
        </ListPageBody>
        {/* 소스코드 목록 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={ASIDE_WIDTH}>
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
  margin-top: 14px;
`;

const EVENT_GRID_ROWS = Math.ceil(KUBERNETES_EVENT_LIST_PAGE_SIZE / 2);

const EventGridWrapper = styled.div<{ $rows: number }>`
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(${({ $rows }) => $rows}, minmax(0, 1fr));
  gap: 8px;
  border-radius: 4px;
  background-color: #fcfcfc;
  height: 620px;
`;

const EventGridStatusWrapper = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuotaSectionTitle = styled(ListSectionTitle)`
  margin-top: 8px;
`;
