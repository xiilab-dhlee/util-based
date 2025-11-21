import styled from "styled-components";

import { SettingMemberListBody } from "./setting-member-list-body";
import { SettingMemberListFilter } from "./setting-member-list-filter";
import { SettingMemberListFooter } from "./setting-member-list-footer";

export function SettingMemberArticle() {
  return (
    <Container>
      <SettingMemberListFilter />
      <SettingMemberListBody />
      <SettingMemberListFooter />
    </Container>
  );
}

const Container = styled.article`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
