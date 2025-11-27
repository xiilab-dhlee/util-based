import styled from "styled-components";
import { type ResponsiveColumnType, Tooltip, Typography } from "xiilab-ui";

import { formatDateTimeSafely } from "@/shared/utils/date.util";
import {
  ColumnAlignCenterWrap,
  ColumnTruncateText,
} from "@/styles/layers/column-layer.styled";
import { DescribeButton } from "./describe-button";
import { YamlLogButton } from "./yaml-log-button";

export const kubernetesResourceListColumn: ResponsiveColumnType[] = [
  {
    title: "리소스 명",
    dataIndex: "resourceName",
    align: "left",
    render: (resourceName: string) => {
      return <ColumnTruncateText width={70}>{resourceName}</ColumnTruncateText>;
    },
  },
  {
    title: "Namespace",
    dataIndex: "namespace",
    align: "left",
    render: (namespace: string) => {
      return (
        <Tooltip
          theme="light"
          placement="top"
          title={
            <NamespaceTooltipContainer>
              <NamespaceTooltipTitle>NameSpace</NamespaceTooltipTitle>
              <NamespaceTooltipRow>
                <NamespaceTooltipLabel>이름</NamespaceTooltipLabel>
                <NamespaceTooltipValue>{namespace}</NamespaceTooltipValue>
              </NamespaceTooltipRow>
            </NamespaceTooltipContainer>
          }
        >
          <ColumnTruncateText width={80}>{namespace}</ColumnTruncateText>
        </Tooltip>
      );
    },
  },
  {
    title: "상태",
    dataIndex: "status",
    align: "left",
  },
  {
    title: "생성일",
    dataIndex: "createDateTime",
    align: "left",
    render: (createDateTime: Date) => {
      const formatted = formatDateTimeSafely(createDateTime);

      return <ColumnAlignCenterWrap>{formatted ?? "-"}</ColumnAlignCenterWrap>;
    },
  },
  {
    title: "Describe",
    dataIndex: "none",
    align: "center",
    width: 70,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <DescribeButton />
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "YAML",
    dataIndex: "none",
    align: "center",
    width: 60,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <YamlLogButton />
        </ColumnAlignCenterWrap>
      );
    },
  },
];

const NamespaceTooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NamespaceTooltipTitle = styled.span`
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: #000;
  padding-bottom: 6px;
  border-bottom: 1px solid #E9EBEE;
`;

const NamespaceTooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NamespaceTooltipLabel = styled.span`
  font-weight: 400;
  font-size: 12px;
line-height: 16px;
  color: var(--color-gray-05);
  white-space: nowrap;
`;

const NamespaceTooltipValue = styled(Typography.Text).attrs({
  variant: "body-2-4",
})`
  color: #000;
  word-break: break-all;
`;
