"use client";

import { useAtomValue } from "jotai";
import { useSession } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { useGetWorkspaceDetail } from "@/api/generated/workspace/workspace";
import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { ActiveOutsideClick } from "@/shared/components/active-outside-click";
import {
  SETTING_EVENTS,
  WORKSPACE_EVENTS,
} from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";

export function WorkspaceSettingMoreDropdown() {
  const publish = usePublish();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const workspaceId = selectedWorkspace?.workspaceId ?? 0;
  const accountId = getSessionAccountId(session);

  const { data: workspaceDetail } = useGetWorkspaceDetail(workspaceId, {
    query: { enabled: Boolean(selectedWorkspace?.workspaceId) },
  });

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(selectedWorkspace?.workspaceId) && Boolean(accountId),
      },
    },
  );

  const canManageWorkspace = isWorkspaceOwnerRole(memberRole?.memberRole);

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  const handleOpenUpdateNotification = () => {
    publish(SETTING_EVENTS.sendUpdateNotificationSetting, {});
  };

  const handleLeaveWorkspaceMember = () => {
    if (!selectedWorkspace?.workspaceId) return;

    publish(WORKSPACE_EVENTS.sendLeaveWorkspace, selectedWorkspace.workspaceId);
  };

  const handleUpdateWorkspace = () => {
    if (!selectedWorkspace?.workspaceId) return;

    publish(WORKSPACE_EVENTS.sendUpdateWorkspace, {
      id: selectedWorkspace.workspaceId,
    });
  };

  const handleDeleteWorkspace = () => {
    if (!selectedWorkspace?.workspaceId || !workspaceDetail?.workspaceName)
      return;

    publish(WORKSPACE_EVENTS.sendDeleteWorkspace, {
      workspaceId: selectedWorkspace.workspaceId,
      workspaceName: workspaceDetail.workspaceName,
    });
  };

  const handleClickUpdateNotification = () => {
    close();
    handleOpenUpdateNotification();
  };

  const handleClickLeaveWorkspaceMember = () => {
    close();
    handleLeaveWorkspaceMember();
  };

  const handleClickUpdateWorkspace = () => {
    close();
    handleUpdateWorkspace();
  };

  const handleClickDeleteWorkspace = () => {
    close();
    handleDeleteWorkspace();
  };

  return (
    <Wrapper>
      <ActiveOutsideClick onClick={close}>
        <MoreButton type="button" onClick={toggle}>
          <Icon name="MoreVertical" color="#e8eaed" size={16} />
          <span className="sr-only">워크스페이스 메뉴</span>
        </MoreButton>
        {isOpen && (
          <Dropdown>
            <DropdownItem>
              <DropdownActionButton
                type="button"
                onClick={handleClickUpdateNotification}
              >
                <span>알림 설정</span>
              </DropdownActionButton>
            </DropdownItem>
            <DropdownItem>
              <DropdownActionButton
                type="button"
                onClick={handleClickLeaveWorkspaceMember}
              >
                <span>워크스페이스 나가기</span>
              </DropdownActionButton>
            </DropdownItem>
            {canManageWorkspace && (
              <>
                <DropdownItem>
                  <DropdownActionButton
                    type="button"
                    onClick={handleClickUpdateWorkspace}
                  >
                    <span>상세 정보 수정</span>
                  </DropdownActionButton>
                </DropdownItem>
                <DropdownItem>
                  <DropdownActionButton
                    type="button"
                    onClick={handleClickDeleteWorkspace}
                  >
                    <span>워크스페이스 삭제</span>
                  </DropdownActionButton>
                </DropdownItem>
              </>
            )}
          </Dropdown>
        )}
      </ActiveOutsideClick>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 34px;
  height: 30px;
  position: relative;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const MoreButton = styled.button`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #171b26;
  border: 1px solid #9a9eb4;
  border-radius: 2px;
  cursor: pointer;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);
`;

const Dropdown = styled.ul`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 120px;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10000;
  background-color: #171b26;
  border: 1px solid #3D4662;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.25);
`;

const DropdownItem = styled.li`
  height: 34px;
  color: #f5f5f5;
  font-size: 12px;
  display: flex;

  & > button {
    width: 100%;
    height: 100%;
    padding: 0px 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
    cursor: pointer;
    background: transparent;
    border: 0;
    color: inherit;
    font: inherit;
  }

  & > button:hover {
    background-color: #544ad8;
    font-weight: 600;
  }

  & > button:focus-visible {
    background-color: #544ad8;
    font-weight: 600;
    outline: 2px solid rgba(232, 234, 237, 0.9);
    outline-offset: -2px;
  }

  & + & {
    border-top: 1px solid #3D4662;
  }
`;

const DropdownActionButton = styled.button``;
