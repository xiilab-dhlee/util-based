"use client";

import styled from "styled-components";
import { Typography } from "xiilab-ui";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { MONITORING_EVENTS } from "@/constants/common/pubsub.constant";
import monitoringNotificationConstants from "@/constants/monitoring/monitoring-notification.constant";
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
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "모니터링 알림" },
];

/**
 * 모니터링 알림 페이지의 메인 컴포넌트
 *
 * 이 컴포넌트는 모니터링 알림을 표시하는 페이지의 주요 레이아웃을 담당합니다.
 * 알림 가이드, 필터링, 표시, 페이지네이션 등의 기능을 포함합니다.
 * 서버에서 전달받은 초기 데이터를 클라이언트 컴포넌트에 전달합니다.
 *
 * @returns 모니터링 알림 페이지 JSX
 */
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
      {/* 페이지 요약 정보 및 브레드크럼 */}
      <PageHeader
        title="모니터링 알림"
        icon="Monitoring01"
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
            guides={monitoringNotificationConstants.guides}
            buttonOptions={{
              enabled: true,
              text: "알림 추가",
              onClick: handleCreateNotification,
            }}
          />

          {/* 모니터링 알림 가이드 이미지 카드 */}
          <PageImageGuide
            title="알림 추가 가이드"
            guideImages={monitoringNotificationConstants.guideImages}
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
