import styled from "styled-components";

import { createPrivateRegistryColumn } from "@/domain/private-registry/components/list/create-private-registry-column";
import { UserPrivateRegistryFilter } from "@/domain/registry/components/user-private-registry-filter";
import { UserPrivateRegistryFooter } from "@/domain/registry/components/user-private-registry-footer";
import { CustomizedTable } from "@/shared/components/table/customized-table";

export function RegistrySubSection() {
  return (
    <Container>
      <Pane>
        <UserPrivateRegistryFilter totalSize={0} loading={false} />
        <PaneBody>
          <CustomizedTable
            columns={createPrivateRegistryColumn()}
            data={[]}
            activePadding
          />
        </PaneBody>
        <UserPrivateRegistryFooter totalSize={0} isLoading={false} />
      </Pane>
    </Container>
  );
}

const Container = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 492px;
`;

const Pane = styled.article`
  height: 100%;
  padding: 24px 26px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

const PaneBody = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
