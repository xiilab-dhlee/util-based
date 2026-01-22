"use client";

import type { PropsWithChildren } from "react";

import { NotificationListArticle } from "@/domain/notification/components/list/notification-list-article";
import { PageHeader } from "@/shared/components/layouts/page-header";
import { ASIDE_WIDTH } from "@/shared/constants/core.constant";
import {
  ListPageAside,
  ListPageBody,
  ListPageMain,
} from "@/styles/layers/list-page-layers.styled";

export default function AdminNotificationLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <PageHeader
        pageKey="admin.notification"
        description="Notification Management"
      />
      <ListPageMain>
        <ListPageBody>
          <NotificationListArticle />
        </ListPageBody>
        <ListPageAside $width={ASIDE_WIDTH}>{children}</ListPageAside>
      </ListPageMain>
    </>
  );
}
