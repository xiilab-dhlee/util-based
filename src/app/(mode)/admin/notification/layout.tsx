"use client";

import type { PropsWithChildren } from "react";

import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { NotificationListBody } from "@/components/notification/list/notification-list-body";
import { NotificationListFilter } from "@/components/notification/list/notification-list-filter";
import { NotificationListFooter } from "@/components/notification/list/notification-list-footer";
import { ADMIN_ROOT_BREADCRUMB_ITEM } from "@/constants/common/core.constant";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  ADMIN_ROOT_BREADCRUMB_ITEM,
  { title: "알림 관리" },
];

/**
 * 알림 관리 목록 페이지 레이아웃
 */
export default function AdminNotificationLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <PageHeader title="알림 관리" icon="" description="Manage Notification">
        <MyBreadcrumb items={BREADCRUMB_ITEMS} />
      </PageHeader>
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
        {children}
      </ListPageMain>
    </>
  );
}
