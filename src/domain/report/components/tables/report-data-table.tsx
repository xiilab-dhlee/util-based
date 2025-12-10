import type { ReactNode } from "react";
import styled from "styled-components";
import { Card, type ResponsiveColumnType, Switch } from "xiilab-ui";

import { CustomizedTable } from "@/shared/components/table/customized-table";

interface ReportDataTableProps<T extends Record<string, unknown>> {
  title: ReactNode;
  columns: ResponsiveColumnType<T & { no: number }>[];
  data: T[];
  idField: keyof T;
  showToggle?: boolean;
  showAll?: boolean;
  onToggleShowAll?: (value: boolean) => void;
  defaultLimit?: number;
}

export function ReportDataTable<T extends Record<string, unknown>>({
  title,
  columns,
  data,
  idField,
  showToggle = false,
  showAll = false,
  onToggleShowAll,
  defaultLimit = 5,
}: ReportDataTableProps<T>) {
  const dataToShow =
    showToggle && !showAll ? data.slice(0, defaultLimit) : data;
  const displayData = dataToShow.map((item, index) => ({
    ...item,
    id: `${String(item[idField])}-${index}`,
    no: index + 1,
  }));

  return (
    <>
      <Header>
        <TitleSection>
          {title}
          <CountLabel>총 {data.length}건</CountLabel>
        </TitleSection>
        {showToggle && (
          <SwitchWrapper>
            <SwitchLabel>전체 보기</SwitchLabel>
            <Switch
              checked={showAll}
              onChange={(checked) => onToggleShowAll?.(checked)}
            />
          </SwitchWrapper>
        )}
      </Header>
      <Card
        showHeader={false}
        hoverable={false}
        contentVariant="compact"
        height="auto"
      >
        <CardBody>
          <TableWrapper>
            <CustomizedTable<T & { no: number }>
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

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const CountLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
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
