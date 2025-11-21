"use client";

import classNames from "classnames";
import { useState } from "react";
import styled from "styled-components";
import { Dropdown } from "xiilab-ui";

import { useGetNotifications } from "@/domain/notification/hooks/use-get-notifications";
import { useSelect } from "@/shared/hooks/use-select";
import { ListEmpty } from "./list-empty";
import { ProfileNotificationCard } from "./profile-notification-card";

export function ProfileNotification() {
  const [tab, setTab] = useState("all");
  const type = useSelect(null, []);

  const { data } = useGetNotifications({
    page: 0,
    size: 10,
  });

  const handleClickTab = (tab: string) => {
    setTab(tab);
  };
  return (
    <Container>
      <Header>
        <Title>알림</Title>
      </Header>
      <Body>
        <Tab>
          <TabItem
            className={classNames({ active: tab === "all" })}
            onClick={() => handleClickTab("all")}
          >
            전체 알림
          </TabItem>
          <TabItem
            className={classNames({ active: tab === "unread" })}
            onClick={() => handleClickTab("unread")}
          >
            미확인 알림
          </TabItem>
        </Tab>
        <TabPanel>
          <TabPanelHeader>
            <Total>알림 8개</Total>
            <Dropdown
              options={type.options}
              value={type.value}
              onChange={type.onChange}
              placeholder="선택"
              width={120}
              height={30}
              theme="dark"
            />
          </TabPanelHeader>
          <TabPanelBody>
            {tab === "all" &&
              data?.content?.map((item) => (
                <ProfileNotificationCard key={item.id} {...item} />
              ))}
            {tab === "unread" && (
              <ListEmpty title="알림이 존재하지 않습니다." theme="dark" />
            )}
          </TabPanelBody>
        </TabPanel>
      </Body>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  background-color: var(--profile-popover-child-bg-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  --user-notification-border-color: rgba(81, 94, 128, 0.3);
`;

const Header = styled.div`
  height: 38px;
  border-bottom: 1px solid var(--user-notification-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #fff;
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Tab = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TabPanel = styled.div`
  padding: 0 16px 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const TabItem = styled.button`
  flex: 1;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 11px;
  line-height: 13px;
  color: #a3afd0;
  border-bottom: 1px solid #4a567c;
  position: relative;

  &.active {
    color: #e1e4e7;
    font-weight: 600;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #4a567c;
  }
`;

const TabPanelHeader = styled.div`
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--user-notification-border-color);
`;

const Total = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  color: #dfdfe0;
`;

const TabPanelBody = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;
