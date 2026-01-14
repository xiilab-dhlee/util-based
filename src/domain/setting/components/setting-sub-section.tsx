import styled from "styled-components";

import { SettingRequestResourceListMain } from "@/domain/setting/components/setting-request-resource-list-main";
import { SettingCredentialListBody } from "./setting-credential-list-body";
import { SettingCredentialListFilter } from "./setting-credential-list-filter";

export function SettingSubSection() {
  return (
    <Container>
      <Left>
        <SettingRequestResourceListMain />
      </Left>
      <Right>
        <SettingCredentialListFilter />
        <SettingCredentialListBody />
      </Right>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 492px;
`;

const Left = styled.article`
  flex: 0;
  flex-basis: 964px;
  height: 100%;
  padding: 23px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  background-color: #fafafa;
`;

const Right = styled(Left)`
  flex: 1;
  padding-bottom: 23px;
`;
