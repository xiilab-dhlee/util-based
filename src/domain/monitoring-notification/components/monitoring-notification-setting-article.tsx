"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { useGetAllMonitoringNotificationSets } from "@/api/generated/admin-monitoring-notification-set/admin-monitoring-notification-set";
import { MonitoringNotificationSettingListBody } from "@/domain/monitoring-notification/components/list/monitoring-notification-setting-list-body";
import { MonitoringNotificationSettingListFooter } from "@/domain/monitoring-notification/components/list/monitoring-notification-setting-list-footer";
import {
  MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT,
  MONITORING_NOTIFICATION_SETTING_PAGE_SIZE,
  MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP,
} from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import {
  monitoringNotificationSettingPageAtom,
  monitoringNotificationSettingSortAtom,
} from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { buildSortRequest, toBackendOrder } from "@/shared/utils/sort.util";
import { subTitleStyle } from "@/styles/mixins/text";

export function MonitoringNotificationSettingArticle() {
  const page = useAtomValue(monitoringNotificationSettingPageAtom);
  const sort = useAtomValue(monitoringNotificationSettingSortAtom);

  const sortRequest = buildSortRequest({
    state: { field: sort.field, order: sort.order },
    fieldMap: MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP,
  }) ??
    buildSortRequest({
      state: MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT,
      fieldMap: MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP,
    }) ?? {
      sort: MONITORING_NOTIFICATION_SETTING_SORT_FIELD_MAP.createdAt,
      order: toBackendOrder(MONITORING_NOTIFICATION_SETTING_DEFAULT_SORT.order),
    };

  const { data, isLoading, isError } = useGetAllMonitoringNotificationSets({
    pageNo: page - 1,
    pageSize: MONITORING_NOTIFICATION_SETTING_PAGE_SIZE,
    sort: sortRequest.sort,
    order: sortRequest.order,
  });

  const content = data?.content ?? [];
  const totalSize = data?.totalSize ?? 0;

  return (
    <Container>
      <ArticleHeader>
        <ArticleTitle variant="subtitle-2">알림 설정</ArticleTitle>
      </ArticleHeader>
      <ArticleBody>
        <MonitoringNotificationSettingListBody
          content={content}
          loading={isLoading}
          isError={isError}
          sort={sort}
        />
        <MonitoringNotificationSettingListFooter
          total={totalSize}
          loading={isLoading}
        />
      </ArticleBody>
    </Container>
  );
}

const Container = styled.article`
  height: 328px;
  border: 1px solid #e0e0e0;
  background-color: #fcfcfc;
  border-radius: 4px;
  padding: 20px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ArticleTitle = styled(Typography.Text)`
  ${subTitleStyle(4)}

  color: #000;
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - 48px);
`;
