"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/atoms/request-resource.atom";
import { LIST_PAGE_SIZE } from "@/constants/common/core.constant";
import { useGetWorkspaceRequestResources } from "@/hooks/workspace/use-get-workspace-request-resources";
import { MySearchFilter } from "@/layouts/common/search-filter";

export function RequestResourceFilter() {
  const page = useAtomValue(requestResourcePageAtom);

  const { data } = useGetWorkspaceRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  return <MySearchFilter title="리소스 신청 목록" total={data?.totalSize} />;
}
