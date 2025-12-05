"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Icon, Tooltip } from "xiilab-ui";

import { isAdminMode } from "@/shared/utils/router.util";
import { ColumnLink } from "@/styles/layers/column-layer.styled";

interface WorkloadNameLinkProps {
  workspaceId: string;
  workloadId: string;
  workloadName: string;
}

export function WorkloadNameLink({
  workspaceId,
  workloadId,
  workloadName,
}: WorkloadNameLinkProps) {
  const pathname = usePathname();

  const isAdmin = isAdminMode(pathname);

  // 워크로드 상세 페이지 링크
  let href = `/user/workload/${workloadId}?workspaceId=${workspaceId}`;
  if (isAdmin) {
    href = `/admin/workspace/workload/${workloadId}?workspaceId=${workspaceId}`;
  }

  return (
    <ColumnLink href={href}>
      <Tooltip title="test" getPopupContainer={() => document.body}>
        <IconWrapper>
          <Icon name="Error" size={16} color="#5F6368" />
          <span className="sr-only">오류</span>
        </IconWrapper>
      </Tooltip>
      {workloadName}
    </ColumnLink>
  );
}

const IconWrapper = styled.div`
  min-width: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
