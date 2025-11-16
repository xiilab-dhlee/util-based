"use client";

import { useState } from "react";
import styled from "styled-components";
import { DateRange, Typography } from "xiilab-ui";

import { CustomizedTable } from "@/components/common/table/customized-table";
import { MONITORING_NOTIFICATION_PAGE_SIZE } from "@/constants/monitoring/monitoring-notification.constant";
import { useGetMonitoringNotifications } from "@/hooks/monitoring/use-get-monitoring-notifications";
import { ListPageFooter } from "@/layouts/list/list-page-footer";
import { ListWrapper } from "@/styles/layers/list-page-layers.styled";
import { subTitleStyle } from "@/styles/mixins/text";
import { createMonitoringNotificationColumn } from "../common/column/create-monitoring-notification-column";
import { SearchInput } from "../common/input/search-input";

export function MonitoringNotificationListArticle() {
  const [page, setPage] = useState(1);

  const { data } = useGetMonitoringNotifications({
    page,
    size: MONITORING_NOTIFICATION_PAGE_SIZE,
    searchText: "",
  });

  return (
    <Container>
      <ArticleHeader>
        <ArticleTitle variant="subtitle-2">알림 내역</ArticleTitle>
        <ArticleHeaderRight>
          <DateRange
            height={30}
            width={250}
            startDate={new Date()}
            endDate={new Date()}
            withTime
            onChange={() => {}}
            maxDate={new Date()}
          />
          <SearchInput />
        </ArticleHeaderRight>
      </ArticleHeader>
      <ArticleBody>
        <CustomizedTable
          columns={createMonitoringNotificationColumn([
            {
              dataIndex: "nodeName",
            },
            {
              dataIndex: "ip",
            },
            {
              dataIndex: "name",
            },
            {
              dataIndex: "channel",
            },
            {
              dataIndex: "creatorDateTime",
              title: "발생일시",
            },
          ])}
          data={data?.content || []}
          activePadding
        />
        <ListPageFooter
          total={100}
          page={page}
          pageSize={MONITORING_NOTIFICATION_PAGE_SIZE}
          onChange={(page: number) => setPage(page)}
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

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ArticleHeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const ArticleTitle = styled(Typography.Text)`
  ${subTitleStyle(4)}

  color: #000;
`;

const ArticleBody = styled(ListWrapper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
