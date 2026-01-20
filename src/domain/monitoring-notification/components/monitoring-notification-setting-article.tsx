"use client";

import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { useGetAllMonitoringNotificationSets } from "@/api/generated/admin-monitoring-notification/admin-monitoring-notification";
import { MonitoringNotificationSettingListBody } from "@/domain/monitoring-notification/components/list/monitoring-notification-setting-list-body";
import { MonitoringNotificationSettingListFooter } from "@/domain/monitoring-notification/components/list/monitoring-notification-setting-list-footer";
import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { monitoringNotificationSettingPageAtom } from "@/domain/monitoring-notification/state/monitoring-notification.atom";
import { subTitleStyle } from "@/styles/mixins/text";

export function MonitoringNotificationSettingArticle() {
  const page = useAtomValue(monitoringNotificationSettingPageAtom);

  const { data, isLoading, isError } = useGetAllMonitoringNotificationSets({
    pageNo: page - 1,
    pageSize: MONITORING_NOTIFICATION_PAGE_SIZE,
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
