"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { useGetProfile } from "@/api/generated/account-profile/account-profile";
import { AdminProfileNotification } from "@/domain/notification/components/profile/admin-profile-notification";
import { ProfileNotification } from "@/domain/notification/components/profile/profile-notification";
import { ProfileInfo } from "@/shared/components/popover/profile-info";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { openProfilePopoverAtom } from "@/shared/state/modal.atom";
import { isAdminMode } from "@/shared/utils/router.util";

export function ProfilePopover() {
  const { data: session } = useSession();
  const accountId = session?.user?.id ?? "";

  const { data: profile } = useGetProfile(accountId, {
    query: { enabled: Boolean(accountId) },
  });

  const pathname = usePathname();
  const { open, onClose } = useGlobalModal(openProfilePopoverAtom);
  const isAdminPage = isAdminMode(pathname);

  return (
    <Container>
      <Header>
        <Title>프로필</Title>
        <CloseButton onClick={onClose}>
          <Icon name="Close" color="#CAD1DB" />
          <span className="sr-only">popover 닫기</span>
        </CloseButton>
      </Header>
      <Body>
        <ProfileInfo profile={profile} />
        {isAdminPage ? (
          <AdminProfileNotification open={open} />
        ) : (
          <ProfileNotification open={open} />
        )}
      </Body>
    </Container>
  );
}

// Popover Content Styles
const Container = styled.div`
  width: 300px;
  height: 660px;
  border-radius: 4px;
  border: 1px solid var(--profile-popover-border-color);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  background-color: #0d1016;

  --profile-popover-border-color: #4a5576;
  --profile-popover-child-bg-color: #171b26;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  background-color: rgba(39, 46, 67, 0.8);
  border-bottom: 1px solid var(--profile-popover-border-color);
  height: 38px;
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
`;

const Title = styled.div`
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;
