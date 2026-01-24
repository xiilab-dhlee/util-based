"use client";

import { Popover } from "antd";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon, Tag } from "xiilab-ui";

import { useGetNotifications } from "@/api/generated/account-notification/account-notification";
import { useGetProfile } from "@/api/generated/account-profile/account-profile";
import { useGetAdminNotifications } from "@/api/generated/admin-account-notification/admin-account-notification";
import {
  AdminNotificationSortRequestOrder,
  AdminNotificationSortRequestSort,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ActiveOutsideClick } from "@/shared/components/active-outside-click";
import { ProfilePopover } from "@/shared/components/popover/profile-popover";
import { NOTIFICATION_POLLING_INTERVAL } from "@/shared/constants/notification/notification.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openProfilePopoverAtom } from "@/shared/state/modal.atom";
import { isAdminMode } from "@/shared/utils/router.util";

export function Profile() {
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";
  const pathname = usePathname();
  const isAdmin = isAdminMode(pathname);

  const { data: profile } = useGetProfile(accountId, {
    query: { enabled: Boolean(accountId) },
  });

  // 읽지 않은 알림 확인 (사용자용)
  const { data: userNotifications } = useGetNotifications(
    accountId,
    {
      pageableRequest: { pageNo: 0, pageSize: 1 },
      filterRequest: { hasRead: false },
    },
    {
      query: {
        enabled: Boolean(accountId) && !isAdmin,
        refetchInterval: NOTIFICATION_POLLING_INTERVAL,
      },
    },
  );

  // 읽지 않은 알림 확인 (관리자용)
  const { data: adminNotifications } = useGetAdminNotifications(
    accountId,
    {
      pageRequest: { pageNo: 0, pageSize: 1 },
      filterRequest: { hasRead: false },
      sortRequest: {
        order: AdminNotificationSortRequestOrder.DESC,
        sort: AdminNotificationSortRequestSort.CREATED_AT,
      },
    },
    {
      query: {
        enabled: Boolean(accountId) && isAdmin,
        refetchInterval: NOTIFICATION_POLLING_INTERVAL,
      },
    },
  );

  const hasUnreadNotifications = isAdmin
    ? (adminNotifications?.totalSize ?? 0) > 0
    : (userNotifications?.totalSize ?? 0) > 0;

  const userName = profile?.accountName ?? "-";
  const email = profile?.email ?? "-";

  const [showDropdown, setShowDropdown] = useState(false);
  const { open, onToggle } = useGlobalModal(openProfilePopoverAtom);

  const handleToggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  const handlePopoverOpenChange = () => {
    onToggle();
  };

  const handleLogout = () => {
    signOut({});
  };

  return (
    <Container>
      <Left>
        <Popover
          placement="right"
          content={<ProfilePopover />}
          trigger="click"
          arrow={false}
          open={open}
          onOpenChange={handlePopoverOpenChange}
          styles={{
            root: {
              left: "210px",
              top: "calc(100% - 710px)",
              zIndex: 998,
              borderRadius: 4,
            },
            body: {
              padding: 0,
            },
          }}
        >
          <User>
            <Avatar $hasUnread={hasUnreadNotifications}>
              <IconWrapper>
                <Icon name="Astrago" color="#fff" size={18} />
              </IconWrapper>
            </Avatar>
            <UserBody>
              <UserHeader>
                {isAdmin && (
                  <AdminTag
                    backgroundColor="#FFFFFF33"
                    borderColor="#77787D"
                    rounded
                    color="#F8F8F8"
                  >
                    관리자
                  </AdminTag>
                )}
                <UserName className="truncate">{userName}</UserName>
              </UserHeader>
              <UserEmail className="truncate">{email}</UserEmail>
            </UserBody>
          </User>
        </Popover>
      </Left>
      <Right>
        <ActiveOutsideClick onClick={handleCloseDropdown}>
          <OpenDropdownButton onClick={handleToggleDropdown}>
            <Icon name="MoreVertical" color="#e8eaed" size={16} />
          </OpenDropdownButton>
          {showDropdown && (
            <Dropdown>
              <DropdownItem as="button" onClick={handleLogout}>
                <span>로그아웃</span>
              </DropdownItem>
            </Dropdown>
          )}
        </ActiveOutsideClick>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 4px;
  width: 184px;
  height: 50px;
  background-color: #171b26;
  border: 1px solid #2b3246;
`;

const Left = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  overflow: hidden;
`;

const User = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 12px 12px;
  height: 100%;
  gap: 6px;
  flex: 1;
  overflow: hidden;
`;

const Avatar = styled.div<{ $hasUnread?: boolean }>`
  position: relative;

  &:after {
    position: absolute;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: -1px;
    right: -1px;
    background-color: #ae00ff;
    border: 1px solid #2d303e;
    z-index: 5;
    display: ${({ $hasUnread }) => ($hasUnread ? "block" : "none")};
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #070913;

  --icon-fill: #fff;
`;

const OpenDropdownButton = styled.button`
  padding: 5px;
`;

const UserBody = styled.div`
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  min-width: 0;
`;

const AdminTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  min-height: 16px;
  line-height: 16px;
  white-space: nowrap;
  padding: 0 6px;
  max-width: none;
  overflow: visible;
  text-overflow: initial;
`;

const UserEmail = styled.span`
  line-height: 1;
  font-size: 10px;
  height: 12px;
  font-weight: 200;
  color: #cfcfcf;
  text-align: left;
`;

const UserName = styled.span`
  line-height: 1;
  font-size: 12px;
  height: 14px;
  font-weight: 400;
  color: #fff;
  text-align: left;
`;

const Right = styled.div`
  width: 36px;
  position: relative;
  --icon-fill: #e8eaed;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Dropdown = styled.ul`
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: #fafafa;
  border: 1px solid #ced3d8;
  border-radius: 4px;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  width: 112px;
  z-index: 10000;
`;

const DropdownItem = styled.li`
  padding: 9px;
  color: #363b47;
  font-weight: 400;
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  --icon-fill: #363b47;

  &:hover {
    color: #544ad8;
    font-weight: 600;
    --icon-fill: #544ad8;
  }

  & + & {
    border-top: 1px solid #ced3d8;
  }
`;
