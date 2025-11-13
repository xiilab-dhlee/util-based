"use client";

import classNames from "classnames";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "xiilab-ui";

import { MySelect } from "@/components/common/select";
import { useSelect } from "@/hooks/common/use-select";
import { ListEmpty } from "@/layouts/list/list-empty";

export function UserAlert() {
  const [tab, setTab] = useState("all");
  const { value, setValue, options } = useSelect(null, []);

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
          <Filter>
            <Total>알림 8개</Total>
            <MySelect
              options={options} // 워크로드 상태 옵션들
              placeholder="선택" // 플레이스홀더 텍스트
              setValue={setValue} // 값 변경 핸들러
              value={value} // 현재 선택된 상태 값
              width={120} // 선택기 너비
              height={30} // 선택기 높이
              theme="dark"
            />
          </Filter>
          <List>
            {tab === "unread" && (
              <ListEmpty title="알림이 존재하지 않습니다." theme="dark" />
            )}
            {tab === "all" && (
              <>
                <Item>
                  <IconWrapper>
                    <Icon name="NotiFilled" color="#A4C8FF" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage>
                      서경덕님이 리소스 요청을 하였습니다.
                    </ItemMessage>
                    <ItemTime>1시간전</ItemTime>
                  </ItemBody>
                </Item>
                <Item>
                  <IconWrapper>
                    <Icon name="Delete" color="#fff" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage>
                      서경덕님이 회원가입을 요청하였습니다.
                    </ItemMessage>
                    <ItemTime>1시간전</ItemTime>
                  </ItemBody>
                </Item>
                <Item>
                  <IconWrapper>
                    <Icon name="PriorityHigh" color="#FFA3A3" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage>
                      워크스페이스 1의 리소스가 초과되었습니다.
                    </ItemMessage>
                    <ItemTime>1시간전</ItemTime>
                  </ItemBody>
                </Item>
                <Item>
                  <IconWrapper>
                    <Icon name="PersonFilled" color="#A4C8FF" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage>
                      서경덕님이 회원가입을 요청하였습니다.
                    </ItemMessage>
                    <ItemTime>1시간전</ItemTime>
                  </ItemBody>
                </Item>
                <Item>
                  <IconWrapper>
                    <Icon name="Delete" color="#fff" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage className="read">
                      서경덕님이 회원가입을 요청하였습니다.
                    </ItemMessage>
                    <ItemTime className="read">1시간전</ItemTime>
                  </ItemBody>
                </Item>
                <Item>
                  <IconWrapper>
                    <Icon name="Delete" color="#fff" size={14} />
                  </IconWrapper>
                  <ItemBody>
                    <ItemMessage className="read">
                      서경덕님이 회원가입을 요청하였습니다.
                    </ItemMessage>
                    <ItemTime className="read">1시간전</ItemTime>
                  </ItemBody>
                </Item>
              </>
            )}
          </List>
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

  --user-alert-border-color: rgba(81, 94, 128, 0.3);
`;

const Header = styled.div`
  height: 38px;
  border-bottom: 1px solid var(--user-alert-border-color);
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

const Filter = styled.div`
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--user-alert-border-color);
`;

const Total = styled.div`
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  color: #dfdfe0;
`;

const List = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
`;

const Item = styled.li`
  padding: 10px 0;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const IconWrapper = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid rgba(81, 94, 128, 0.7);
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemMessage = styled.a`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  color: rgba(245, 245, 245, 0.9);
  text-decoration: none;

  &.read {
    color: #969a9f;
  }
`;

const ItemTime = styled.time`
  font-weight: 400;
  font-size: 10px;
  line-height: 12px;
  color: #fff;

  &.read {
    color: #969a9f;
  }
`;
