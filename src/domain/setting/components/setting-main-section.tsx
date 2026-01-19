import { useAtomValue } from "jotai";
import styled from "styled-components";
import { Icon, Tooltip, Typography } from "xiilab-ui";

import { SettingMemberArticle } from "@/domain/setting/components/setting-member-article";
import { SettingWorkloadArticle } from "@/domain/setting/components/setting-workload-article";
import { SettingWorkspaceDetail } from "@/domain/setting/components/setting-workspace-detail";
import { WorkspaceSettingMoreDropdown } from "@/domain/setting/components/workspace-setting-more-dropdown";
import { WORKSPACE_EVENTS } from "@/shared/constants/pubsub.constant";
import { usePublish } from "@/shared/hooks/use-pub-sub";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";

export function SettingMainSection() {
  const publish = usePublish();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);

  const isDefaultWorkspace = selectedWorkspace?.isDefault ?? false;

  const handleClickSetDefaultWorkspace = () => {
    if (!selectedWorkspace) return;
    if (!selectedWorkspace.workspaceId) return;
    if (selectedWorkspace.isDefault) return;

    publish(
      WORKSPACE_EVENTS.sendSetDefaultWorkspace,
      selectedWorkspace.workspaceId,
    );
  };

  return (
    <Container>
      <Left>
        <Header>
          <Title>워크스페이스</Title>
          <Tools>
            <Tooltip
              placement="top"
              theme="light"
              maxWidth={320}
              title={
                <>
                  이 워크스페이스는 Default값으로 설정하며,
                  <br />
                  기존 워크스페이스는 해제됩니다.
                </>
              }
            >
              <PrimaryButtonTooltipAnchor>
                <PrimaryButton
                  type="button"
                  onClick={handleClickSetDefaultWorkspace}
                  disabled={isDefaultWorkspace}
                  aria-disabled={isDefaultWorkspace}
                >
                  <Icon name="Workspace01" color="#ffffff" size={18} />
                  <span>Default 워크스페이스 지정</span>
                </PrimaryButton>
              </PrimaryButtonTooltipAnchor>
            </Tooltip>
            <WorkspaceSettingMoreDropdown />
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
  height: var(--user-monitoring-main-section-height);
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--user-monitoring-main-section-margin-bottom);
  gap: 16px;
  
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
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
  padding: 20px 22px;
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

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background: #171b26;
  border: 1px solid #9a9eb4;
  border-radius: 2px;
  line-height: 1;
  padding: 0 10px;
  color: #fff;
  cursor: pointer;
  box-shadow:
    0px 2px 4px 0px rgba(8, 10, 15, 1),
    inset 0px 2px 4px -1px rgba(8, 10, 15, 1);

  font-weight: 600;
  font-size: 12px;

  gap: 3px;

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PrimaryButtonTooltipAnchor = styled.span`
  display: inline-flex;
`;
