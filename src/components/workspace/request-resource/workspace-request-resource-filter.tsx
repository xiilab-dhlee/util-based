"use client";

import { useAtomValue } from "jotai";

import { workspaceRequestResourcePageAtom } from "@/atoms/workspace/workspace-request-resource.atom";
import workspaceRequestResourceConstants from "@/constants/workspace/workspace-request-resource.constant";
import { useGetWorkspaceRequestResources } from "@/hooks/workspace/use-get-workspace-request-resources";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function WorkspaceRequestResourceFilter() {
  const page = useAtomValue(workspaceRequestResourcePageAtom);

  const { data } = useGetWorkspaceRequestResources({
    page,
    size: workspaceRequestResourceConstants.pageSize,
  });

  return <MySearchFilter title="리소스 신청 목록" total={data?.totalSize} />;
}

