import styled from "styled-components";
import { Icon, Typography } from "xiilab-ui";

import { SETTING_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { SettingMemberArticle } from "./setting-member-article";
import { SettingWorkloadArticle } from "./setting-workload-article";
import { SettingWorkspaceDetail } from "./setting-workspace-detail";

export function SettingMainSection() {
  const publish = usePublish();

  const handleOpenUpdateNotification = () => {
    publish(SETTING_EVENTS.sendUpdateNotificationSetting, {});
  };

  const handleLeaveWorkspaceMember = () => {
    alert("준비 중입니다.");
  };

  return (
    <Container>
      <Left>
        <Header>
          <Title>워크스페이스</Title>
          <Tools>
            <StyledButton onClick={handleOpenUpdateNotification}>
              <Icon name="Noti" color="#ffffff" size={24} />
              <span>알림 설정</span>
            </StyledButton>
            <StyledButton onClick={handleLeaveWorkspaceMember}>
              <span>워크스페이스 나가기</span>
            </StyledButton>
          </Tools>
        </Header>
        <LeftBody>
          <SettingWorkloadArticle />
          <SettingWorkspaceDetail />
        </LeftBody>
      </Left>
      <Right>
        <SettingMemberArticle />
      </Right>
    </Container>
  );
}

const Container = styled.section`
  height: var(--dashboard-main-section-height);
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--dashboard-main-section-margin-bottom);
  gap: 16px;
  
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Tools = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const Title = styled(Typography.Text).attrs({
  variant: "subtitle-1", // 16px variant
  as: "h2",
})`
  color: #f5f5f5;
  margin: 0;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  padding: 23px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  background-color: #fafafa;
`;

const Left = styled.article`
  min-width: 964px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  background-color: #171b26;
  padding: 22px 20px;
  background-color: #070913;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
  padding: 23px;

  --primary-border-color: #3a4561;
  --secondary-border-color: #2a3041;
`;

const LeftBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background: #171b26;
  border: 1px solid #9a9eb4;
  border-radius: 2px;
  line-height: 1;
  padding: 0 16px;
  color: #fff;
  cursor: pointer;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);

  // Typography styles
  font-weight: 600;
  font-size: 12px;
`;
