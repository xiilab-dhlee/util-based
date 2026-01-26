"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Icon, Tooltip } from "xiilab-ui";

import type { WorkloadReclaimScanResultResponseReclaimStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { ChangeCircleIcon } from "@/shared/components/icon/change-circle-icon";
import { RevokeWarningTooltipTitle } from "@/shared/components/tooltip-title/revoke-warning-tooltip-title";
import { ROUTES } from "@/shared/constants/routes.constant";
import { WORKLOAD_SELECTOR } from "@/shared/constants/selector.constant";
import { isAdminMode } from "@/shared/utils/router.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface WorkloadNameLinkProps {
  workspaceId: number;
  workloadId: string;
  workloadName: string;
  reclaimWarningCount?: number;
  reclaimStatus?: WorkloadReclaimScanResultResponseReclaimStatus;
}

/**
 *
 * 워크로드 이름 링크 컴포넌트는 워크로드 이름을 클릭하면 워크로드 상세 페이지로 이동하는 링크를 제공합니다.
 *
 * @param workspaceId - 워크로드 워크스페이스 ID
 * @param workloadId - 워크로드 ID
 * @param workloadName - 워크로드 이름
 * @param reclaimWarningCount - 리소스 회수 경고 횟수
 * @param reclaimStatus - 리소스 회수 상태 (RECLAIMED: 회수됨, WARNING: 경고, NORMAL: 정상)
 * @returns
 */
export function WorkloadNameLink({
  workspaceId,
  workloadId,
  workloadName,
  reclaimWarningCount = 0,
  reclaimStatus = "NORMAL",
}: WorkloadNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 워크로드 상세 페이지 링크
  const userHref = ROUTES.USER_WORKLOAD_DETAIL(String(workspaceId), workloadId);
  const adminHref = ROUTES.ADMIN_WORKSPACE_WORKLOAD_DETAIL(
    String(workspaceId),
    workloadId,
  );
  const href = isAdmin ? adminHref : userHref;

  const hasWarning = reclaimStatus === "WARNING";
  const isReclaimed = reclaimStatus === "RECLAIMED";

  return (
    <ColumnLink href={href}>
      {/* 리소스 회수 경고 아이콘 */}
      {hasWarning && (
        <IconWrapper>
          <Tooltip
            title={<RevokeWarningTooltipTitle count={reclaimWarningCount} />}
            placement="bottom"
            getPopupContainer={() => document.body}
          >
            <Icon
              name="Error"
              size={17}
              color="#5F6368"
              style={{ paddingTop: 2.5 }}
            />
            <span className="sr-only">리소스 회수 경고</span>
          </Tooltip>
        </IconWrapper>
      )}
      {/* 회수된 상태 아이콘 */}
      {isReclaimed && (
        <IconWrapper>
          <ChangeCircleIcon fill="#FF0000" width={16} height={16} />
          <span className="sr-only">리소스 회수된 상태</span>
        </IconWrapper>
      )}
      <Title className="truncate" data-testid={WORKLOAD_SELECTOR.NAME}>
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
