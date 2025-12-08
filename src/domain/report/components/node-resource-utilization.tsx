import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Card, Switch } from "xiilab-ui";

import { createNodeResourceUtilizationColumn } from "@/domain/report/columns/create-node-resource-utilization-column";
import { useGetReportDetail } from "@/domain/report/hooks/use-get-report-detail";
import type { NodeResourceUtilization as NodeResourceUtilizationType } from "@/domain/report/schemas/report.schema";
import { CustomizedTable } from "@/shared/components/table/customized-table";

export function NodeResourceUtilization() {
  const params = useParams<{ id: string }>();
  const { data } = useGetReportDetail(params.id);
  const [showAll, setShowAll] = useState(false);

  const nodeResourceUtilization = data?.nodeResourceUtilization || [];

  const displayData = useMemo(() => {
    const dataToShow = showAll
      ? nodeResourceUtilization
      : nodeResourceUtilization.slice(0, 5);
    return dataToShow.map((node, index) => ({
      ...node,
      id: node.nodeName,
      no: index + 1,
    }));
  }, [showAll, nodeResourceUtilization]);

  const columns = createNodeResourceUtilizationColumn<
    NodeResourceUtilizationType & { no: number }
  >();

  return (
    <>
      <Header>
        <Title>3. 노드별 리소스 활용 정보</Title>
        <SwitchWrapper>
          <SwitchLabel>전체 보기</SwitchLabel>
          <Switch checked={showAll} onChange={setShowAll} />
        </SwitchWrapper>
      </Header>
      <Card
        showHeader={false}
        hoverable={false}
        contentVariant="compact"
        height="auto"
      >
        <CardBody>
          <TableWrapper>
            <CustomizedTable<NodeResourceUtilizationType & { no: number }>
              columns={columns}
              data={displayData}
              headerFontSize={11}
              bodyFontSize={12}
              columnHeight={40}
              headerHeight={32}
              activePadding={true}
            />
          </TableWrapper>
        </CardBody>
      </Card>
    </>
  );
}

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 16px 12px;
  gap: 12px;
  background-color: #fcfcfc;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h5`
  font-weight: 700;
  font-size: 15px;
  line-height: 16px;
`;

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SwitchLabel = styled.span`
  font-size: 12px;
  color: #666666;
`;

const TableWrapper = styled.div`
  width: 100%;
  min-height: 250px;
`;
