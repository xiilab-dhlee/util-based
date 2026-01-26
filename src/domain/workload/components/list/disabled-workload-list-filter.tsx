"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { Input } from "xiilab-ui";

import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { DisabledWorkloadJobTypeSort } from "@/domain/workload/components/list/disabled-workload-job-type-sort";
import {
  disabledWorkloadIsMineAtom,
  disabledWorkloadPageAtom,
  disabledWorkloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface DisabledWorkloadListFilterProps {
  total: number;
  isLoading: boolean;
}

/**
 * 비활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 *
 * 비활성화 워크로드 목록 페이지에서 검색어, 작업 유형 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param isLoading - 로딩 상태
 * @returns 비활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 */
export function DisabledWorkloadListFilter({
  total,
  isLoading,
}: DisabledWorkloadListFilterProps) {
  const { data: session } = useSession();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const accountId = getSessionAccountId(session);

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId ?? -1,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(workspaceId) && Boolean(accountId),
      },
    },
  );

  const canShowMyItemsSwitch = isWorkspaceOwnerRole(memberRole?.memberRole);

  const setSearchText = useSetAtom(disabledWorkloadSearchTextAtom);
  const resetPage = useResetAtom(disabledWorkloadPageAtom);
  const [isMine, setIsMine] = useAtom(disabledWorkloadIsMineAtom);

  /**
   * 검색 핸들러
   * 검색 시 페이지를 초기화하고 검색을 실행
   */
  const handleSearch = (value: string) => {
    resetPage();
    setSearchText(value.trim());
  };

  /**
   * 내 항목만 보기 토글 핸들러
   */
  const handleIsMineChange = (checked: boolean) => {
    resetPage();
    setIsMine(checked);
  };

  return (
    <MySearchFilter
      title="워크로드 목록"
      total={total}
      totalCountTestId={SELECTOR.LIST_TOTAL_COUNT}
    >
      {canShowMyItemsSwitch && (
        <MyItemsOnlySwitch checked={isMine} onChange={handleIsMineChange} />
      )}
      <DisabledWorkloadJobTypeSort disabled={isLoading} />
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={isLoading}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
