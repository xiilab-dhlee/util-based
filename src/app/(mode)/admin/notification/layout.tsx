"use client";

import type { PropsWithChildren } from "react";

import { DeleteNotificationModal } from "@/domain/notification/components/delete-notification-modal";
import { NotificationListBody } from "@/domain/notification/components/list/notification-list-body";
import { NotificationListFilter } from "@/domain/notification/components/list/notification-list-filter";
import { NotificationListFooter } from "@/domain/notification/components/list/notification-list-footer";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

/**
 * 알림 관리 목록 페이지 레이아웃
 */
export default function AdminNotificationLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <PageHeader
        pageKey="admin.notification"
        description="Notification Management"
      />
      {/* 알림 목록 페이지 메인 영역 */}
      <ListPageMain>
        {/* 알림 목록 페이지 - 오른쪽 영역 (필터, 목록, 페이지네이션) */}
        <ListPageBody>
          {/* 알림 목록 필터 */}
          <NotificationListFilter />
          {/* 알림 목록 본문 */}
          <NotificationListBody />
          {/* 알림 목록 페이지네이션 */}
          <NotificationListFooter />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
      {/* 알림 삭제 모달 */}
      <DeleteNotificationModal />
    </>
  );
}
