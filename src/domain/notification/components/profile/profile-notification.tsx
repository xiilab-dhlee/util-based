"use client";

import { Spin } from "antd";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";
import { Dropdown } from "xiilab-ui";

import type { NotificationItemResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
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
import { UserNotificationDetailModal } from "@/domain/notification/components/profile/user-notification-detail-modal";
import { useMarkUserNotificationAsReadAction } from "@/domain/notification/hooks/notification-actions";
import { useInfiniteNotifications } from "@/domain/notification/hooks/use-infinite-notifications";
import { useInfiniteWorkspaces } from "@/domain/workspace/hooks/use-infinite-workspaces";
import { EmptyState } from "@/shared/components/empty-state/empty-state";
import { DataErrorState } from "@/shared/components/feedback/data-error-state";
import {
  ALL_OPTION,
  DROPDOWN_LIST_HEIGHT,
} from "@/shared/constants/core.constant";
import {
  getHasReadFromTab,
  NOTIFICATION_TAB,
  type NotificationTabValue,
} from "@/shared/constants/notification";
import { useDropdownInfiniteScroll } from "@/shared/hooks/use-infinite-scroll";
import { getSessionAccountId } from "@/shared/utils/auth.util";
import { getBackendErrorMessage } from "@/shared/utils/error/error.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";

interface ProfileNotificationProps {
  open?: boolean;
}

export function ProfileNotification({ open }: ProfileNotificationProps) {
  const { data: session } = useSession();
  const accountId = getSessionAccountId(session) ?? "";
  const [tab, setTab] = useState<NotificationTabValue>(NOTIFICATION_TAB.ALL);

  // 모달 상태
  const [selectedItem, setSelectedItem] =
    useState<NotificationItemResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 읽음 처리
  const { mutate: markAsRead } = useMarkUserNotificationAsReadAction();

  // 워크스페이스 필터
  const {
    workspaces,
    fetchNextPage: fetchNextWorkspacePage,
    hasNextPage: hasNextWorkspacePage,
    isFetchingNextPage: isFetchingNextWorkspacePage,
  } = useInfiniteWorkspaces();

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | "">(
    ALL_OPTION.value,
  );

  const workspaceOptions = [
    { value: ALL_OPTION.value, label: ALL_OPTION.label },
    ...workspaces.map((ws) => ({
      value: ws.workspaceId,
      label: ws.workspaceName,
    })),
  ];

  const handleWorkspaceChange = (value: number | string | null) => {
    if (value === null || value === "") {
      setSelectedWorkspaceId("");
    } else {
      setSelectedWorkspaceId(Number(value));
    }
  };

  const { handlePopupScroll: handleWorkspacePopupScroll } =
    useDropdownInfiniteScroll({
      hasNextPage: hasNextWorkspacePage,
      isFetchingNextPage: isFetchingNextWorkspacePage,
      fetchNextPage: fetchNextWorkspacePage,
      threshold: 16,
    });

  // 팝오버가 열릴 때 필터 초기화
  useEffect(() => {
    if (open) {
      setTab(NOTIFICATION_TAB.ALL);
      setSelectedWorkspaceId(ALL_OPTION.value);
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
  } = useInfiniteNotifications({
    hasRead,
    workspaceId: selectedWorkspaceId ? Number(selectedWorkspaceId) : undefined,
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

  const handleCardClick = (item: NotificationItemResponse) => {
    setSelectedItem(item);
    setIsModalOpen(true);

    // 읽지 않은 알림인 경우 읽음 처리
    if (!item.isRead && accountId) {
      markAsRead(
        { accountId, notificationId: item.notificationId },
        {
          onError: (error) => {
            toast.error(getBackendErrorMessage(error));
          },
        },
      );
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
                options={workspaceOptions}
                value={selectedWorkspaceId}
                onChange={handleWorkspaceChange}
                placeholder="워크스페이스"
                width={120}
                height={30}
                theme="dark"
                listHeight={DROPDOWN_LIST_HEIGHT}
                onPopupScroll={handleWorkspacePopupScroll}
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

      <UserNotificationDetailModal
        open={isModalOpen}
        item={selectedItem}
        onClose={handleCloseModal}
      />
    </>
  );
}
