"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";
import {
  MONITORING_NOTIFICATION_GUIDE_IMAGES,
  MONITORING_NOTIFICATION_GUIDES,
} from "@/constants/monitoring/monitoring-notification.constant";
import { usePublish } from "@/hooks/common/use-pub-sub";
import { PageGuide } from "@/layouts/common/page-guide";
import { PageHeader } from "@/layouts/common/page-header";
import { PageImageGuide } from "@/layouts/common/page-image-guide";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";
import { ManageMonitoringNotificationModal } from "./manage-monitoring-notification-modal";
import { MonitoringNotificationListArticle } from "./monitoring-notification-list-article";
import { MonitoringNotificationSettingArticle } from "./monitoring-notification-setting-article";
import { ViewMonitoringNotificationModal } from "./view-monitoring-notification-modal";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "모니터링 알림" },
];

export function MonitoringNotificationMain() {
  const publish = usePublish();

  const handleCreateNotification = () => {
    publish(MONITORING_EVENTS.sendUpsertNotification, {
      id: -1,
      name: "",
      isEmail: false,
      isSystem: false,
      settings: [],
    });
  };

  return (
    <>
      <PageHeader
        title="모니터링 알림"
        icon="Alarm"
        description="Monitoring Notifications"
      >
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>

      {/* 모니터링 알림 페이지 메인 영역 */}
      <ListPageMain>
        {/* 모니터링 알림 페이지 - 왼쪽 영역 (가이드 및 생성 카드) */}
        <ListPageAside $width={400}>
          <PageGuide
            titleEng="Create Notification"
            title="알림 추가"
            icon="Plus"
            description={[
              "알림을 추가 후 알림 수신방법과(E-mail, System)",
              "알림 설정을 통해 모니터링 알림을 관리해 보세요.",
            ]}
            backgroundImageName="workload-intro-background.png"
            guides={MONITORING_NOTIFICATION_GUIDES}
            buttonOptions={{
              enabled: true,
              text: "알림 추가",
              onClick: handleCreateNotification,
            }}
          />

          {/* 모니터링 알림 가이드 이미지 카드 */}
          <PageImageGuide
            title="알림 추가 가이드"
            guideImages={MONITORING_NOTIFICATION_GUIDE_IMAGES}
          />
        </ListPageAside>

        {/* 모니터링 알림 페이지 - 오른쪽 영역 (필터, 본문, 페이지네이션) */}
        <ListPageBody>
          <SectionHeader>
            <Typography.Text variant="title-2">모니터링 알림</Typography.Text>
          </SectionHeader>
          <MonitoringNotificationSettingArticle />
          <MonitoringNotificationListArticle />
        </ListPageBody>
      </ListPageMain>
      {/* 모니터링 알림 설정 모달 */}
      <ManageMonitoringNotificationModal />
      {/* 모니터링 알림 설정 상세 모달 */}
      <ViewMonitoringNotificationModal />
    </>
  );
}

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
