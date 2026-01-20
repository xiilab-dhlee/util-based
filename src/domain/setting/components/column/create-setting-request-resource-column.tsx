import type { ResponsiveColumnType } from "xiilab-ui";
import { Tooltip } from "xiilab-ui";

import type {
  ResourceRequestListResponse,
  ResourceRequestListResponseApprovalStatus,
} from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SettingRequestResourceCancelButton } from "@/domain/setting/components/request-resource-list/setting-request-resource-cancel-button";
import { SettingRequestResourceRejectReasonButton } from "@/domain/setting/components/request-resource-list/setting-request-resource-reject-reason-button";
import { SettingRequestResourceRequestReasonButton } from "@/domain/setting/components/request-resource-list/setting-request-resource-request-reason-button";
import type { SettingRequestResourceSortField } from "@/domain/setting/constants/setting.constant";
import { getApprovalStatusLabel } from "@/domain/setting/utils/resource-request-approval-status.util";
import { ResourceRequestStatusLabel } from "@/shared/components/resource-request/status-label";
import { GuideTooltip } from "@/shared/components/tooltip/guide-tooltip";
import { MigTooltipContent } from "@/shared/components/tooltip-content/mig-tooltip-content";
import type {
  AntdTableSortState,
  CoreCreateColumnConfig,
} from "@/shared/types/core.model";
import { applyColumnConfigs } from "@/shared/utils/column.util";
import { formatDateTimeSafely } from "@/shared/utils/date.util";
import { formatNumberWithUnit } from "@/shared/utils/format.util";
import { convertBytes, getResourceInfo } from "@/shared/utils/resource.util";
import { getColumnSortOrder } from "@/shared/utils/sort.util";
import { ColumnAlignCenterWrap } from "@/styles/layers/column-layer.styled";
import { TooltipHighlightText } from "@/styles/mixins/text";

type CreateSettingRequestResourceColumnParams = {
  sortState: AntdTableSortState<SettingRequestResourceSortField>;
};

const createColumnList = ({
  sortState,
}: CreateSettingRequestResourceColumnParams): ResponsiveColumnType<ResourceRequestListResponse>[] => {
  const gpuInfo = getResourceInfo("GPU");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");
  const migInfo = getResourceInfo("MIG");
  const mpsInfo = getResourceInfo("MPS");

  return [
    {
      key: "creatorName",
      title: "요청자",
      dataIndex: "creatorName",
      align: "left",
      width: "12%",
      ellipsis: true,
      sorter: true,
      sortOrder: getColumnSortOrder(sortState, "creatorName"),
      render: (creatorName: string | undefined | null) => {
        return <span>{creatorName || "-"}</span>;
      },
    },
    {
      key: "requestedAt",
      dataIndex: "requestedAt",
      title: "요청일시",
      align: "left",
      width: "14%",
      sorter: true,
      sortOrder: getColumnSortOrder(sortState, "requestedAt"),
      render: (requestedAt: string) => {
        return <span>{formatDateTimeSafely(requestedAt)}</span>;
      },
    },
    {
      key: "gpu",
      title: gpuInfo.text,
      align: "center",
      width: "6%",
      render: (_, record) => {
        const count = record.resource.gpu?.detail.normal?.requestCount;
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(count, gpuInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mig",
      title: (
        <ColumnAlignCenterWrap>
          {migInfo.text}
          <GuideTooltip
            title={
              <>
                마우스를 올리면 현재{" "}
                <TooltipHighlightText>
                  보유 중인 MIG의 수량
                </TooltipHighlightText>
                과<br /> 각{" "}
                <TooltipHighlightText> 용량 정보</TooltipHighlightText>를 확인할
                수 있습니다.
              </>
            }
          />
        </ColumnAlignCenterWrap>
      ),
      align: "center",
      width: "9%",
      render: (_, record) => {
        const migProfiles = record.resource.gpu?.detail.mig ?? [];
        const count = migProfiles.length;

        if (count === 0) {
          return (
            <ColumnAlignCenterWrap>
              {formatNumberWithUnit(count, migInfo.unit)}
            </ColumnAlignCenterWrap>
          );
        }

        return (
          <ColumnAlignCenterWrap>
            <Tooltip
              title={<MigTooltipContent migProfiles={migProfiles} />}
              placement="top"
            >
              <span>{formatNumberWithUnit(count, migInfo.unit)}</span>
            </Tooltip>
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "mps",
      title: mpsInfo.text,
      align: "center",
      width: "6%",
      render: (_, record) => {
        const count = record.resource.gpu?.detail.mps?.requestCount;
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(count, mpsInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cpu",
      title: cpuInfo.text,
      align: "center",
      width: "5%",
      render: (_, record) => {
        const requestCore = record.resource?.cpu?.requestCore;
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(requestCore, cpuInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "memory",
      title: memInfo.text,
      align: "center",
      width: "7%",
      render: (_, record) => {
        const requestByte = record.resource?.memory?.requestByte;

        if (!requestByte) {
          return <ColumnAlignCenterWrap>-</ColumnAlignCenterWrap>;
        }

        const { value } = convertBytes(requestByte, "GB");
        return (
          <ColumnAlignCenterWrap>
            {formatNumberWithUnit(value, memInfo.unit)}
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "approvalStatus",
      dataIndex: "approvalStatus",
      title: "승인 여부",
      align: "center",
      width: "12%",
      sorter: true,
      sortOrder: getColumnSortOrder(sortState, "approvalStatus"),
      render: (approvalStatus: ResourceRequestListResponseApprovalStatus) => {
        return (
          <ResourceRequestStatusLabel status={approvalStatus}>
            {getApprovalStatusLabel(approvalStatus)}
          </ResourceRequestStatusLabel>
        );
      },
    },
    {
      key: "approvedAt",
      dataIndex: "approvedAt",
      title: "승인일시",
      align: "left",
      width: "14%",
      render: (approvedAt: string | undefined) => {
        return <span>{formatDateTimeSafely(approvedAt)}</span>;
      },
    },
    {
      key: "rejectReason",
      dataIndex: "rejectReason",
      title: "반려사유",
      align: "center",
      width: "5%",
      render: (rejectReason: string | undefined, record) => {
        const isRejected = record.approvalStatus === "REJECTED";
        return (
          <ColumnAlignCenterWrap>
            <SettingRequestResourceRejectReasonButton
              reason={rejectReason ?? ""}
              disabled={!isRejected}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "requestReason",
      dataIndex: "requestReason",
      title: "요청사유",
      align: "center",
      width: "5%",
      render: (value: string) => {
        return (
          <ColumnAlignCenterWrap>
            <SettingRequestResourceRequestReasonButton reason={value} />
          </ColumnAlignCenterWrap>
        );
      },
    },
    {
      key: "cancel",
      title: "요청 취소",
      align: "center",
      width: "5%",
      render: (_, record) => {
        const isWaiting = record.approvalStatus === "WAITING";

        return (
          <ColumnAlignCenterWrap>
            <SettingRequestResourceCancelButton
              resourceRequestId={record.resourceRequestId}
              disabled={!isWaiting}
            />
          </ColumnAlignCenterWrap>
        );
      },
    },
  ];
};

export const createSettingRequestResourceColumn = (
  params: CreateSettingRequestResourceColumnParams,
  config?: CoreCreateColumnConfig[],
): ResponsiveColumnType<ResourceRequestListResponse>[] => {
  const columnList = createColumnList(params);
  return applyColumnConfigs<ResourceRequestListResponse>(columnList, config);
};
