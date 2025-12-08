"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Icon, Tooltip } from "xiilab-ui";

import { ChangeCircleIcon } from "@/shared/components/icon/change-circle-icon";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { isAdminMode } from "@/shared/utils/router.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";
import { ResourceRecoveryWarningTooltip } from "./resource-recovery-warning-tooltip";

interface WorkloadNameLinkProps {
  workspaceId: string;
  workloadId: string;
  workloadName: string;
  resourceRecoveryWarningCount?: number;
  // 회수된 상태인지 여부
  isRevoked?: boolean;
  /** 테스트를 위한 data-testid 속성 */
  "data-testid"?: string;
}

export function WorkloadNameLink({
  workspaceId,
  workloadId,
  workloadName,
  resourceRecoveryWarningCount = 0,
  isRevoked,
  "data-testid": dataTestId,
}: WorkloadNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 워크로드 상세 페이지 링크
  let href = `/user/workload/${workloadId}?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}?workspaceId=${workspaceId}`;
  }

  const isWarningRecovery = resourceRecoveryWarningCount > 0;

  return (
    <ColumnLink href={href} data-testid={dataTestId}>
      {/* 리소스 회수 경고 아이콘 */}
      {isWarningRecovery && (
        <IconWrapper>
          <Tooltip
            maxWidth={100}
            title={
              <ResourceRecoveryWarningTooltip
                count={resourceRecoveryWarningCount}
              />
            }
            placement="bottom"
            getPopupContainer={() => document.body}
          >
            <Icon name="Error" size={16} color="#5F6368" />
            <span className="sr-only">리소스 회수 경고</span>
          </Tooltip>
        </IconWrapper>
      )}
      {/* 회수된 상태 아이콘 */}
      {isRevoked && (
        <IconWrapper>
          <ChangeCircleIcon fill="#FF0000" width={16} height={16} />
          <span className="sr-only">회수된 상태</span>
        </IconWrapper>
      )}
      <Title
        className="truncate"
        data-testid={WORKLOAD_SELECTOR.name(workloadId)}
      >
        {workloadName}
      </Title>
    </ColumnLink>
  );
}

const IconWrapper = styled.span`
  min-width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  flex: 1;
`;
