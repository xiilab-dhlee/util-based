"use client";

import { useState } from "react";
import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { CustomizedTable } from "@/components/common/table/customized-table";
import monitoringNotificationConstants from "@/constants/monitoring/monitoring-notification.constant";
import { useGetMonitoringNotificationSettings } from "@/hooks/monitoring/use-get-monitoring-notification-settings";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import createMonitoringNotificationColumn from "../common/column/create-monitoring-notification-column";

export function MonitoringNotificationSettingArticle() {
  const [page, setPage] = useState(1);

  const { data } = useGetMonitoringNotificationSettings({
    page,
    size: monitoringNotificationConstants.pageSize,
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
