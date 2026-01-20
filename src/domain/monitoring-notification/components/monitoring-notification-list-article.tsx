"use client";

import { useAtomValue } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useEffect } from "react";
import styled from "styled-components";

import { useGetAllMonitoringNotificationHistories } from "@/api/generated/admin-monitoring-notification/admin-monitoring-notification";
import { MonitoringNotificationHistoryListBody } from "@/domain/monitoring-notification/components/list/monitoring-notification-history-list-body";
import { MonitoringNotificationHistoryListFilter } from "@/domain/monitoring-notification/components/list/monitoring-notification-history-list-filter";
import { MonitoringNotificationHistoryListFooter } from "@/domain/monitoring-notification/components/list/monitoring-notification-history-list-footer";
import {
  MONITORING_NOTIFICATION_HISTORY_SORT_FIELD_MAP,
  MONITORING_NOTIFICATION_PAGE_SIZE,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  monitoringNotificationHistoryDateRangeAtom,
  monitoringNotificationHistorySortAtom,
  monitoringNotificationPageAtom,
  monitoringNotificationSearchTextAtom,
} from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { formatDateForRequest } from "@/shared/utils/date.util";
import { buildSortRequest } from "@/shared/utils/sort.util";

export function MonitoringNotificationListArticle() {
  const resetPage = useResetAtom(monitoringNotificationPageAtom);
  const resetSearchText = useResetAtom(monitoringNotificationSearchTextAtom);
  const resetSort = useResetAtom(monitoringNotificationHistorySortAtom);
  const resetDateRange = useResetAtom(
    monitoringNotificationHistoryDateRangeAtom,
  );

  const page = useAtomValue(monitoringNotificationPageAtom);
  const searchText = useAtomValue(monitoringNotificationSearchTextAtom);
  const sort = useAtomValue(monitoringNotificationHistorySortAtom);
  const dateRange = useAtomValue(monitoringNotificationHistoryDateRangeAtom);

  const sortRequest = buildSortRequest({
    state: sort,
    fieldMap: MONITORING_NOTIFICATION_HISTORY_SORT_FIELD_MAP,
  });

  const { data, isLoading, isError } = useGetAllMonitoringNotificationHistories(
    {
      pageNo: page - 1,
      pageSize: MONITORING_NOTIFICATION_PAGE_SIZE,
      keyword: searchText || undefined,
      ...sortRequest,
      startedAt: dateRange?.start
        ? formatDateForRequest(dateRange.start)
        : undefined,
      endedAt: dateRange?.end ? formatDateForRequest(dateRange.end) : undefined,
    },
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 초기화 시 의존성 배열 비워둠
  useEffect(() => {
    resetPage();
    resetSearchText();
    resetSort();
    resetDateRange();
  }, []);

  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  return (
    <Container>
      <MonitoringNotificationHistoryListFilter loading={isLoading} />
      <ArticleBody>
        <MonitoringNotificationHistoryListBody
          content={content}
          loading={isLoading}
          isError={isError}
        />
        <MonitoringNotificationHistoryListFooter
          total={totalSize}
          loading={isLoading}
        />
      </ArticleBody>
    </Container>
  );
}

const Container = styled.article`
  flex: 1;
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
  border-radius: 4px;
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
