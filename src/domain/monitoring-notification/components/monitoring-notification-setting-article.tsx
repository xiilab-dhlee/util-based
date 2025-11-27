"use client";

import { useState } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { createMonitoringNotificationColumn } from "@/domain/monitoring-notification/column/create-monitoring-notification-column";
import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/domain/monitoring-notification/constants/monitoring-notification.constant";
import { useGetMonitoringNotifications } from "@/domain/monitoring-notification/hooks/use-get-monitoring-notifications";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";

export function MonitoringNotificationSettingArticle() {
  const [page, setPage] = useState(1);

  const { data } = useGetMonitoringNotifications({
    page,
    size: MONITORING_NOTIFICATION_PAGE_SIZE,
    searchText: "",
  });

  return (
    <Container>
      <ArticleHeader>
        <ArticleTitle variant="subtitle-2">알림 설정</ArticleTitle>
      </ArticleHeader>
      <ArticleBody>
        <CustomizedTable
          columns={createMonitoringNotificationColumn([
            {
              dataIndex: "name",
            },
            {
              dataIndex: "channel",
            },
            {
              dataIndex: "status",
            },
            {
              dataIndex: "delete",
            },
          ])}
          data={data?.content || []}
          pagination={{
            onChange: (page: number) => setPage(page),
            pageSize: 5, // 한 페이지당 표시할 항목 수
            total: 100, // 전체 데이터 개수
          }}
          activePadding
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

const ArticleBody = styled(ListWrapper)``;
