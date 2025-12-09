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
  revokeWarningCount?: number;
  isRevoked?: boolean;
}

/**
 *
 * 워크로드 이름 링크 컴포넌트는 워크로드 이름을 클릭하면 워크로드 상세 페이지로 이동하는 링크를 제공합니다.
 *
 * @param workspaceId - 워크로드 워크스페이스 ID
 * @param workloadId - 워크로드 ID
 * @param workloadName - 워크로드 이름
 * @param revokeWarningCount - 리소스 회수 경고 횟수
 * @param isRevoked - 회수된 상태 여부
 * @returns
 */
export function WorkloadNameLink({
  workspaceId,
  workloadId,
  workloadName,
  revokeWarningCount = 0,
  isRevoked,
}: WorkloadNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 워크로드 상세 페이지 링크
  let href = `/user/workload/${workloadId}?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}?workspaceId=${workspaceId}`;
  }

  const hasWarning = revokeWarningCount > 0;

  return (
    <ColumnLink href={href}>
      {/* 리소스 회수 경고 아이콘 */}
      {hasWarning && (
        <IconWrapper>
          <Tooltip
            title={
              <ResourceRecoveryWarningTooltip count={revokeWarningCount} />
            }
            placement="bottom"
            getPopupContainer={() => document.body}
          >
            <Icon name="Error" size={17} color="#5F6368" />
            <span className="sr-only">리소스 회수 경고</span>
          </Tooltip>
        </IconWrapper>
      )}
      {/* 회수된 상태 아이콘 */}
      {isRevoked && (
        <IconWrapper>
          <ChangeCircleIcon fill="#FF0000" width={16} height={16} />
          <span className="sr-only">리소스 회수된 상태</span>
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
