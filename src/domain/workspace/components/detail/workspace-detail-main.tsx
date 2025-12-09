"use client";

import { isNull } from "es-toolkit";
import { useAtomValue } from "jotai";
import { useParams } from "next/navigation";

import { useGetAdminWorkloads } from "@/domain/workload/hooks/use-get-admin-workloads";
import { AdminWorkloadBody } from "@/domain/workspace/components/detail/admin-workload-body";
import { AdminWorkloadFilter } from "@/domain/workspace/components/detail/admin-workload-filter";
import { AdminWorkloadFooter } from "@/domain/workspace/components/detail/admin-workload-footer";
import {
  adminWorkloadJobTypeAtom,
  adminWorkloadPageAtom,
  adminWorkloadSearchTextAtom,
  adminWorkloadStatusAtom,
} from "@/domain/workspace/state/workspace.atom";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";

/**
 * 워크스페이스 상세 메인 컴포넌트 (관리자용)
 *
 * 워크스페이스 상세 페이지에서 워크로드 목록을 표시합니다.
 * Main 컴포넌트에서 API를 호출하고, 하위 컴포넌트에 props로 데이터를 전달합니다.
 */
export function WorkspaceDetailMain() {
  const { id } = useParams<{ id: string }>();

  const page = useAtomValue(adminWorkloadPageAtom);
  const searchText = useAtomValue(adminWorkloadSearchTextAtom);
  const jobType = useAtomValue(adminWorkloadJobTypeAtom);
  const status = useAtomValue(adminWorkloadStatusAtom);

  const { data, isLoading } = useGetAdminWorkloads({
    workspaceId: id,
    page,
    size: LIST_PAGE_SIZE,
    searchText,
    jobType: isNull(jobType) ? undefined : jobType,
    status: isNull(status) ? undefined : status,
  });

  return (
    <>
      {/* 워크로드 목록 필터 */}
      <AdminWorkloadFilter total={data?.totalSize || 0} loading={isLoading} />
      {/* 워크로드 목록 본문 */}
      <AdminWorkloadBody content={data?.content || []} loading={isLoading} />
      {/* 워크로드 목록 페이지네이션 */}
      <AdminWorkloadFooter total={data?.totalSize || 0} loading={isLoading} />
    </>
  );
}
