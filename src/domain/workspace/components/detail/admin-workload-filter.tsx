"use client";

import { WorkloadJobTypeSort } from "@/domain/workload/components/list/workload-job-type-sort";
import { WorkloadStatusSort } from "@/domain/workload/components/list/workload-status-sort";
import { adminWorkloadSearchTextAtom } from "@/domain/workspace/state/workspace.atom";
import { SearchInput } from "@/shared/components/input/search-input";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { useSearch } from "@/shared/hooks/use-search";

interface AdminWorkloadFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 관리자 워크로드 목록 필터 컴포넌트
 *
 * 워크스페이스 상세 페이지에서 워크로드를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 */
export function AdminWorkloadFilter({
  total,
  loading,
}: AdminWorkloadFilterProps) {
  const { onSubmit } = useSearch(adminWorkloadSearchTextAtom);

  return (
    <MySearchFilter title="워크로드 목록" total={total}>
      <WorkloadJobTypeSort disabled={loading} />
      <WorkloadStatusSort disabled={loading} />
      <form onSubmit={onSubmit}>
        <SearchInput disabled={loading} />
      </form>
    </MySearchFilter>
  );
}
