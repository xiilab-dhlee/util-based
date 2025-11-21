"use client";

import { Popover } from "antd";
import { signOut } from "next-auth/react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { ActiveOutsideClick } from "@/shared/components/active-outside-click";
import { AstragoIcon } from "@/shared/components/icon/astrago-icon";
import { ProfilePopover } from "@/shared/components/popover/profile-popover";
import { openProfilePopoverAtom } from "@/shared/hooks/modal.atom";
import { useGlobalModal } from "@/shared/hooks/use-global-modal";

export function Profile() {
  // 임시 사용자 정보
  const userName = "관리자";
  const email = "admin@xiilab.com";

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
        <User>
          <Popover
            placement="right"
            content={<ProfilePopover userName={userName} email={email} />}
            trigger="click"
            arrow={false}
            open={open}
            onOpenChange={handlePopoverOpenChange}
            styles={{
              root: {
                left: "210px",
                top: "calc(100% - 710px)",
                zIndex: 10000,
                borderRadius: 4,
              },
              body: {
                padding: 0,
              },
            }}
          >
            <Avatar>
              <IconWrapper>
                <AstragoIcon />
              </IconWrapper>
            </Avatar>
          </Popover>
          <UserBody>
            <UserName className="truncate">{userName}</UserName>
            <UserEmail className="truncate">{email}</UserEmail>
          </UserBody>
        </User>
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

const User = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  padding-right: 0;
  height: 100%;
  gap: 8px;
  flex: 1;
  overflow: hidden;
`;

const Avatar = styled.button`
  position: relative;

  &:after {
    position: absolute;
    content: "";
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: -1px;
    right: -1px;
    background-color: green;
    border: 1px solid #2d303e;
    z-index: 10000;
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

const UserEmail = styled.span`
  line-height: 1;
  font-size: 10px;
  height: 12px;
  font-weight: 200;
  color: #cfcfcf;
`;

const UserName = styled.span`
  line-height: 1;
  font-size: 12px;
  height: 14px;
  font-weight: 400;
  color: #fff;
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
