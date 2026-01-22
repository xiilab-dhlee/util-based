"use client";

import { Spin } from "antd";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Dropdown } from "xiilab-ui";

import type { AdminNotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { AdminNotificationDetailModal } from "@/domain/notification/components/profile/admin-notification-detail-modal";
import {
  Body,
  Container,
  Header,
  LoadingWrapper,
  SentinelDiv,
  Tab,
  TabItem,
  TabPanel,
  TabPanelBody,
  TabPanelHeader,
  Title,
  Total,
} from "@/domain/notification/components/profile/profile-notification.styles";
import { ProfileNotificationCard } from "@/domain/notification/components/profile/profile-notification-card";
import { useMarkAdminNotificationAsReadAction } from "@/domain/notification/hooks/notification-actions";
import { useInfiniteAdminNotifications } from "@/domain/notification/hooks/use-infinite-admin-notifications";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import { ALL_OPTION } from "@/shared/constants/core.constant";
import {
  getHasReadFromTab,
  NOTIFICATION_TAB,
  NOTIFICATION_TYPE_OPTIONS,
  type NotificationTabValue,
  type NotificationTypeValue,
} from "@/shared/constants/notification";
import { useSelect } from "@/shared/hooks/use-select";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";

interface AdminProfileNotificationProps {
  open?: boolean;
}

export function AdminProfileNotification({
  open,
}: AdminProfileNotificationProps) {
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";
  const [tab, setTab] = useState<NotificationTabValue>(NOTIFICATION_TAB.ALL);

  // 모달 상태
  const [selectedItem, setSelectedItem] =
    useState<AdminNotificationItemResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 읽음 처리
  const { mutate: markAsRead } = useMarkAdminNotificationAsReadAction();

  // 알림 유형 필터
  const notificationTypeOptions = [
    { value: ALL_OPTION.value, label: ALL_OPTION.label },
    ...NOTIFICATION_TYPE_OPTIONS,
  ];
  const notificationType = useSelect<NotificationTypeValue | "">(
    null,
    notificationTypeOptions,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: 오픈 시 필터 초기화
  useEffect(() => {
    if (open) {
      setTab(NOTIFICATION_TAB.ALL);
      notificationType.resetValue();
    }
  }, [open]);

  // 탭에 따라 hasRead 파라미터 결정
  const hasRead = getHasReadFromTab(tab);

  const {
    notifications,
    totalSize,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteAdminNotifications({
    hasRead,
    notificationType: notificationType.value || undefined,
  });

  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
    null,
  );

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "150px",
    root: scrollContainer,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleClickAllTab = () => {
    setTab(NOTIFICATION_TAB.ALL);
  };

  const handleClickUnreadTab = () => {
    setTab(NOTIFICATION_TAB.UNREAD);
  };

  const handleCardClick = (item: AdminNotificationItemResponse) => {
    setSelectedItem(item);
    setIsModalOpen(true);

    // 읽지 않은 알림인 경우 읽음 처리
    if (!item.isRead && accountId) {
      markAsRead({ accountId, notificationId: item.notificationId });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <Container>
        <Header>
          <Title>알림</Title>
        </Header>
        <Body>
          <Tab>
            <TabItem
              className={classNames({ active: tab === NOTIFICATION_TAB.ALL })}
              onClick={handleClickAllTab}
            >
              전체 알림
            </TabItem>
            <TabItem
              className={classNames({
                active: tab === NOTIFICATION_TAB.UNREAD,
              })}
              onClick={handleClickUnreadTab}
            >
              미확인 알림
            </TabItem>
          </Tab>
          <TabPanel>
            <TabPanelHeader>
              <Total>알림 {formatNumberWithUnit(totalSize, "개")}</Total>
              <Dropdown
                options={notificationType.options}
                value={notificationType.value}
                onChange={notificationType.onChange}
                placeholder="알림 유형"
                width={120}
                height={30}
                theme="dark"
              />
            </TabPanelHeader>
            <TabPanelBody ref={setScrollContainer}>
              {isLoading && (
                <LoadingWrapper>
                  <Spin size="small" />
                </LoadingWrapper>
              )}
              {!isLoading && isError && <DataErrorState darkMode />}
              {!isLoading && !isError && notifications.length === 0 && (
                <EmptyState />
              )}
              {!isLoading &&
                !isError &&
                notifications.map((item) => (
                  <ProfileNotificationCard
                    key={item.notificationId}
                    item={item}
                    onClick={handleCardClick}
                  />
                ))}
              {hasNextPage && <SentinelDiv ref={sentinelRef} />}
              {isFetchingNextPage && <Spin size="small" />}
            </TabPanelBody>
          </TabPanel>
        </Body>
      </Container>

      <AdminNotificationDetailModal
        open={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </>
  );
}
