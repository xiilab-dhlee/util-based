"use client";

import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";
import { Button, Icon } from "xiilab-ui";

import { AstragoIcon } from "@/shared/components/icon/astrago-icon";
import {
  ADMIN_ROOT_PATH,
  USER_ROOT_PATH,
} from "@/shared/constants/core.constant";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { openProfilePopoverAtom } from "@/shared/state/modal.atom";
import { isAdminMode } from "@/shared/utils/router.util";
import { ProfileNotification } from "../layouts/profile-notification";

interface ProfilePopoverProps {
  userName: string;
  email: string;
}

export function ProfilePopover({ userName, email }: ProfilePopoverProps) {
  const publish = usePublish();

  const router = useRouter();
  const pathname = usePathname();

  const { onClose } = useGlobalModal(openProfilePopoverAtom);

  const isAdmin = isAdminMode(pathname);

  /**
   * 현재 모드에 따른 모드 전환 함수
   */
  const handleModeSwitch = () => {
    if (isAdmin) {
      // 관리자 모드에서 사용자 모드로 전환
      router.replace(USER_ROOT_PATH);
    } else {
      // 사용자 모드에서 관리자 모드로 전환
      router.replace(ADMIN_ROOT_PATH);
    }
  };

  const handleClickEdit = () => {
    onClose();

    publish(COMMON_EVENTS.sendCheckPassword, {
      userName,
      email,
    });
  };

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
        {/* 프로필 정보 */}
        <User>
          <Profile>
            <Avatar>
              <AstragoIcon />
            </Avatar>
            <ProfileBody>
              <UserName>{userName}</UserName>
              <UserEmail>{email}</UserEmail>
              <UpdateButton onClick={handleClickEdit}>
                <Icon name="Edit02" color="#fff" />
                <span className="sr-only">프로필 수정</span>
              </UpdateButton>
            </ProfileBody>
          </Profile>
          <Workspace>
            <WorkspaceTitle>내 워크스페이스</WorkspaceTitle>
            <WorkspaceBody>
              <WorkspaceItem>
                <WorkspaceColumn>
                  <WorkspaceColumnKey>그룹 이름</WorkspaceColumnKey>
                  <WorkspaceColumnValue>
                    AstraGo PO Office_12
                  </WorkspaceColumnValue>
                </WorkspaceColumn>
              </WorkspaceItem>
              <WorkspaceItem>
                <WorkspaceRow>
                  <WorkspaceColumn>
                    <WorkspaceColumnKey>보유 개수</WorkspaceColumnKey>
                    <WorkspaceColumnValue>13개</WorkspaceColumnValue>
                  </WorkspaceColumn>
                  <WorkspaceColumn className="divider">
                    <WorkspaceColumnKey>생성 제한 개수</WorkspaceColumnKey>
                    <WorkspaceColumnValue>1개</WorkspaceColumnValue>
                  </WorkspaceColumn>
                </WorkspaceRow>
              </WorkspaceItem>
            </WorkspaceBody>
          </Workspace>
          <Button
            icon="PersonFilled"
            iconColor="#CED5DB"
            width="100%"
            height={30}
            onClick={handleModeSwitch}
            style={{
              backgroundColor: "transparent",
              borderColor: "#515E80",
              outline: "1px solid #242A3D",
              color: "#F5F5F5",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {isAdmin ? "사용자 " : "관리자"} 전환
          </Button>
        </User>
        {/* 알림 */}
        <ProfileNotification />
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

const User = styled.div`
  padding-top: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background-color: var(--profile-popover-child-bg-color);

  --user-detail-border-color: rgba(81, 94, 128, 0.7);
  --user-detail-border-radius: 2px;
  --user-detail-divider-color: rgba(81, 94, 128, 0.5);
`;

const Profile = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: var(--user-detail-border-radius);
  border: 1px solid var(--user-detail-border-color);
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  --icon-fill: #fff;

  & svg {
    width: 24px;
    height: 24px;
  }
`;

const ProfileBody = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
`;

const UserEmail = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #d0d0d0;
`;

const UpdateButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: var(--user-detail-border-radius);
  border: 1px solid var(--user-detail-border-color);
`;

const Workspace = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WorkspaceTitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #eef3ff;
`;

const WorkspaceBody = styled.div`
  background-color: #242a3d;
  border-radius: var(--user-detail-border-radius);
  padding: 0 10px;
  height: 72px;
  display: flex;
  flex-direction: column;
`;

const WorkspaceItem = styled.div`
  flex: 1;
  padding: 8px 0;

  & + & {
    border-top: 1px solid var(--user-detail-divider-color);
  }
`;

const WorkspaceColumn = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
  flex: 1;

  & + & {
    border-left: 1px solid var(--user-detail-divider-color);
    margin-left: 10px;
    padding-left: 10px;
  }
`;

const WorkspaceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkspaceColumnKey = styled.div`
  font-weight: 400;
  font-style: Regular;
  font-size: 10px;
  line-height: 12px;
  color: #dfdfe0;
`;

const WorkspaceColumnValue = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: #f5f5f5;
`;
