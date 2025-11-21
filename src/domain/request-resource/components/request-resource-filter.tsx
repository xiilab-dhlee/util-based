"use client";

import { useAtomValue } from "jotai";

import { requestResourcePageAtom } from "@/domain/request-resource/state/request-resource.atom";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { useGetRequestResources } from "../hooks/use-get-request-resources";

export function RequestResourceFilter() {
  const page = useAtomValue(requestResourcePageAtom);

  const { data } = useGetRequestResources({
    page,
    size: LIST_PAGE_SIZE,
  });

  return <MySearchFilter title="리소스 신청 목록" total={data?.totalSize} />;
}
