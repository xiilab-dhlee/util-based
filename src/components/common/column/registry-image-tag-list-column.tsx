import { Label, type ResponsiveColumnType } from "xiilab-ui";

import { RegistryImageTagAllCheck } from "@/components/registry/registry-image/registry-image-tag-all-check";
import { RegistryImageTagItemCheck } from "@/components/registry/registry-image/registry-image-tag-item-check";
import type { RegistryImageTag } from "@/types/registry/registry.model";
import { ColumnAlignCenterWrap } from "../../../styles/layers/column-layer.styled";
import ViewRejectReasonButton from "../button/view-reject-reason-button";
import ViewRequestReasonButton from "../button/view-request-reason-button";
import SecurityTooltip from "../tooltip/security-tooltip";

export const registryImageTagListColumn: ResponsiveColumnType[] = [
  {
    title: <RegistryImageTagAllCheck />,
    dataIndex: "id",
    align: "center",
    width: 40,
    render: (_: string, record: RegistryImageTag) => {
      return <RegistryImageTagItemCheck content={record} />;
    },
  },
  {
    title: "태그",
    dataIndex: "tag",
    align: "left",
  },
  {
    title: "이미지 크기",
    dataIndex: "imageSize",
    align: "center",
  },
  {
    title: "보안 검사 상태",
    dataIndex: "lastCheckedAt",
    align: "center",
    width: 90,
    render: () => {
      return (
        <ColumnAlignCenterWrap>
          <Label variant="blue">완료</Label>
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "보안 검사 결과",
    dataIndex: "id",
    align: "center",
    width: 90,
    render: (_: number, record: RegistryImageTag) => {
      return (
        <ColumnAlignCenterWrap>
          <SecurityTooltip
            critical={record.critical}
            high={record.high}
            medium={record.medium}
            low={record.low}
          />
        </ColumnAlignCenterWrap>
      );
    },
  },
  {
    title: "생성자",
    dataIndex: "creator",
    align: "center",
  },
  {
    title: "생성날짜",
    dataIndex: "createdAt",
    align: "center",
  },
  {
    title: "최근 검증일시",
    dataIndex: "lastCheckedAt",
    align: "center",
  },
  {
    title: "사용/요청 상태",
    dataIndex: "available",
    align: "center",
    width: 90,
    render: () => {
      return <span>승인</span>;
    },
  },
  {
    title: "요청 사유",
    dataIndex: "rejectReason",
    align: "center",
    width: 100,
    render: (rejectReason: string) => {
      return <ViewRequestReasonButton reason={rejectReason} />;
    },
  },
  {
    title: "승인/반려 사유",
    dataIndex: "rejectReason",
    align: "center",
    width: 90,
    render: (rejectReason: string) => {
      return <ViewRejectReasonButton reason={rejectReason} />;
    },
  },
];
