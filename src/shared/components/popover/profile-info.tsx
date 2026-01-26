"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import styled from "styled-components";
import { Button, Icon } from "xiilab-ui";

import type { ProfileResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  ADMIN_ROOT_PATH,
  USER_ROOT_PATH,
} from "@/shared/constants/core.constant";
import { COMMON_EVENTS } from "@/shared/constants/pubsub.constant";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { openProfilePopoverAtom } from "@/shared/state/modal.atom";
import { checkIsUser } from "@/shared/utils/auth.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { isAdminMode } from "@/shared/utils/router.util";

interface ProfileInfoProps {
  profile?: ProfileResponse;
}

export function ProfileInfo({ profile }: ProfileInfoProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const publish = usePublish();
  const { onClose } = useGlobalModal(openProfilePopoverAtom);

  const isAdminPage = isAdminMode(pathname);
  const isUserRole = checkIsUser(session);

  const groupNames = profile?.groupName ?? [];
  const workspaceCount = profile?.workspaceCount;
  const workspaceLimitCount = profile?.workspaceLimitCount;

  const handleClickEdit = () => {
    onClose();
    publish(COMMON_EVENTS.sendCheckPassword, {});
  };

  const handleModeSwitch = () => {
    onClose();
    router.replace(isAdminPage ? USER_ROOT_PATH : ADMIN_ROOT_PATH);
  };
  return (
    <Container>
      <Profile>
        <Avatar>
          <Icon name="Astrago" color="#fff" size={26} />
        </Avatar>
        <ProfileBody>
          <UserName>{profile?.accountName || "-"}</UserName>
          <UserEmail>{profile?.email ?? "-"}</UserEmail>
          <UpdateButton onClick={handleClickEdit}>
            <Icon name="Edit02" color="#fff" size={14} />
            <span className="sr-only">프로필 수정</span>
          </UpdateButton>
        </ProfileBody>
      </Profile>
      <GroupSection>
        <GroupTitle>그룹 이름</GroupTitle>
        <GroupList>
          {groupNames.length > 0 ? (
            groupNames.map((name, index) => (
              <GroupItem key={index}>{name}</GroupItem>
            ))
          ) : (
            <GroupItem>-</GroupItem>
          )}
        </GroupList>
      </GroupSection>
      <Workspace>
        <WorkspaceTitle>나의 워크스페이스</WorkspaceTitle>
        <WorkspaceBody>
          <WorkspaceRow>
            <WorkspaceColumn>
              <WorkspaceColumnKey>생성 개수</WorkspaceColumnKey>
              <WorkspaceColumnValue>
                {formatNumberWithUnit(workspaceCount, "개")}
              </WorkspaceColumnValue>
            </WorkspaceColumn>
            <WorkspaceColumn className="divider">
              <WorkspaceColumnKey>생성 제한 개수</WorkspaceColumnKey>
              <WorkspaceColumnValue>
                {formatNumberWithUnit(workspaceLimitCount, "개")}
              </WorkspaceColumnValue>
            </WorkspaceColumn>
          </WorkspaceRow>
        </WorkspaceBody>
      </Workspace>
      {!isUserRole && (
        <ModeSwitchButton
          icon="PersonFilled"
          iconColor="#CED5DB"
          width="100%"
          height={30}
          onClick={handleModeSwitch}
        >
          {isAdminPage ? "사용자" : "관리자"} 전환
        </ModeSwitchButton>
      )}
    </Container>
  );
}

const Container = styled.div`
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
`;

const ProfileBody = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  padding-right: 34px;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const UserEmail = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #d0d0d0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

const GroupSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.div`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #eef3ff;
`;

const GroupList = styled.div`
  background-color: #242a3d;
  border-radius: var(--user-detail-border-radius);
  padding: 8px 10px;
  height: 50px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GroupItem = styled.div`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: #f5f5f5;
  flex-shrink: 0;
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
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
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

const ModeSwitchButton = styled(Button)`
  background-color: transparent;
  border-color: #515e80;
  outline: 1px solid #242a3d;
  color: #f5f5f5;
  font-weight: 600;
  font-size: 12px;
`;
