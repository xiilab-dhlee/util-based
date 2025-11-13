import styled from "styled-components";

import privateRegistryListConstants from "@/constants/registry/private-registry-list.constant";
import privateRegistryListColumn from "../common/columns/private-registry-list-column";
import CustomizedTable from "../common/table/customized-table";
import UserPrivateRegistryListFilter from "./user-private-registry-list-filter";
import UserPublicRegistryListFilter from "./user-public-registry-list-filter";

export function RegistrySubSection() {
  return (
    <Container>
      <Pane>
        <UserPublicRegistryListFilter />
        <RightBody>
          <CustomizedTable
            columns={privateRegistryListColumn}
            data={privateRegistryListConstants.listDemo}
            activePadding
            pagination={{
              onChange: function Xs() {}, // 페이지 변경 핸들러 (현재 미구현)
              pageSize: 8, // 한 페이지당 표시할 항목 수
              total: 100,
            }}
          />
        </RightBody>
      </Pane>
      <Pane>
        <UserPrivateRegistryListFilter />
        <RightBody>
          <CustomizedTable
            columns={privateRegistryListColumn}
            data={privateRegistryListConstants.listDemo}
            activePadding
            pagination={{
              onChange: function Xs() {}, // 페이지 변경 핸들러 (현재 미구현)
              pageSize: 8, // 한 페이지당 표시할 항목 수
              total: 100,
            }}
          />
        </RightBody>
      </Pane>
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

const Pane = styled.article`
  flex: 1;
  height: 100%;
  padding: 24px 26px;
  padding-bottom: 0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const RightBody = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
