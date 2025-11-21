"use client";

import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { PageGuide } from "@/shared/components/layouts/page-guide";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { PageImageGuide } from "@/shared/components/layouts/page-image-guide";
import { MONITORING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import type { CoreGuide, CoreGuideImage } from "@/shared/types/core.model";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import { ManageMonitoringNotificationModal } from "./manage-monitoring-notification-modal";
import { MonitoringNotificationListArticle } from "./monitoring-notification-list-article";
import { MonitoringNotificationSettingArticle } from "./monitoring-notification-setting-article";
import { ViewMonitoringNotificationModal } from "./view-monitoring-notification-modal";

const GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/monitoring-notification-guide1.png",
    alt: "모니터링 알림 가이드 1",
  },
  {
    id: "2",
    src: "/images/monitoring-notification-guide2.png",
    alt: "모니터링 알림 가이드 2",
  },
  {
    id: "3",
    src: "/images/monitoring-notification-guide3.png",
    alt: "모니터링 알림 가이드 3",
  },
];

const GUIDES: CoreGuide[] = [
  {
    icon: <Icon name="Setting01" color="var(--icon-fill)" />,
    title: "알림 설정이란?",
    description: [
      "원하는 알림을 상단의 '알림 추가' 버튼으로 등록하세요.",
      "등록된 알림은 아래에서 설정 수정 및 삭제가 가능합니다.",
    ],
  },
  {
    icon: <Icon name="Request" color="var(--icon-fill)" />,
    title: "알림 내역이란?",
    description: [
      "생성한 알림 설정을 통해 오는 알림 리스트를 보여주는 영역입니다.",
      "이름, 주소, 이름, 채널, 발생일시 등을 전달합니다.",
    ],
  },
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
        pageKey="admin.monitoring-notification"
        description="Monitoring Notifications"
      />

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
            guides={GUIDES}
            buttonOptions={{
              enabled: true,
              text: "알림 추가",
              onClick: handleCreateNotification,
            }}
          />

          {/* 모니터링 알림 가이드 이미지 카드 */}
          <PageImageGuide title="알림 추가 가이드" guideImages={GUIDE_IMAGES} />
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
