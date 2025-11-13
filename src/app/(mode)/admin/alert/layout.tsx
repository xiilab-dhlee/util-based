"use client";

import type { PropsWithChildren } from "react";

import { AlertListBody } from "@/components/alert/list/alert-list-body";
import { AlertListFilter } from "@/components/alert/list/alert-list-filter";
import { AlertListFooter } from "@/components/alert/list/alert-list-footer";
import { MyBreadcrumb } from "@/components/common/breadcrumb";
import { PageHeader } from "@/layouts/common/page-header";
import {
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";
import type { CoreBreadcrumbItem } from "@/types/common/core.model";

const BREADCRUMB_ITEMS: CoreBreadcrumbItem[] = [
  {
    title: "대시보드",
    icon: "Dashboard",
    href: "/admin",
  },
  { title: "알림 관리" },
];

/**
 * 알림 관리 목록 페이지 레이아웃
 */
export default function AdminAlertLayout({ children }: PropsWithChildren) {
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
          <AlertListFilter />
          {/* 알림 목록 본문 */}
          <AlertListBody />
          {/* 알림 목록 페이지네이션 */}
          <AlertListFooter />
        </ListPageBody>
        {children}
      </ListPageMain>
    </>
  );
}
