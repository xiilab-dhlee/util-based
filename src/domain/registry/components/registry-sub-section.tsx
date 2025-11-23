import styled from "styled-components";

import { useGetInternalRegistryImages } from "@/domain/internal-registry-image/hooks/use-get-internal-registry-images";
import { createInternalRegistryImageColumn } from "@/shared/components/column/create-internal-registry-image-column";
import { CustomizedTable } from "@/shared/components/table/customized-table";
import { UserInternalRegistryListFilter } from "./user-internal-registry-list-filter";

export function RegistrySubSection() {
  const { data } = useGetInternalRegistryImages({
    page: 1,
    size: 100,
    searchText: "",
  });

  return (
    <Container>
      <Pane>
        <UserInternalRegistryListFilter />
        <PaneBody>
          <CustomizedTable
            columns={createInternalRegistryImageColumn([
              {
                dataIndex: "imageName",
              },
              {
                dataIndex: "tagCnt",
              },
              {
                dataIndex: "pullCount",
              },
              {
                dataIndex: "creatorName",
              },
              {
                dataIndex: "creatorDate",
              },
            ])}
            data={data?.content || []}
            activePadding
            pagination={{
              onChange: function Xs() {},
              pageSize: 10,
              total: data?.content?.length || 0,
            }}
          />
        </PaneBody>
      </Pane>
      <Pane>
        <UserInternalRegistryListFilter />
        <PaneBody>
          <CustomizedTable
            columns={createInternalRegistryImageColumn([
              {
                dataIndex: "imageName",
              },
              {
                dataIndex: "tagCnt",
              },
              {
                dataIndex: "pullCount",
              },
              {
                dataIndex: "creatorName",
              },
              {
                dataIndex: "creatorDate",
              },
            ])}
            data={data?.content || []}
            activePadding
            pagination={{
              onChange: function Xs() {},
              pageSize: 10,
              total: data?.content?.length || 0,
            }}
          />
        </PaneBody>
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

const PaneBody = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
