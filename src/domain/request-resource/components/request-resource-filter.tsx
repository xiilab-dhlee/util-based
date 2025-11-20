"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { useGetWorkspaceRequestResources } from "@/domain/workspace/hooks/use-get-workspace-request-resources";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { MySearchFilter } from "@/shared/layouts/common/search-filter";

export function RequestResourceFilter() {
  const page = useAtomValue(requestResourcePageAtom);

  const { data } = useGetWorkspaceRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  return <MySearchFilter title="리소스 신청 목록" total={data?.totalSize} />;
}
