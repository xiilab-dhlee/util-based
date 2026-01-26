"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { useSession } from "next-auth/react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Input } from "xiilab-ui";

import { useGetWorkspaceMemberRole } from "@/api/generated/workspace-member/workspace-member";
import { ActiveWorkloadJobTypeSort } from "@/domain/workload/components/list/active-workload-job-type-sort";
import { ActiveWorkloadStatusSort } from "@/domain/workload/components/list/active-workload-status-sort";
import {
  activeWorkloadIsMineAtom,
  activeWorkloadPageAtom,
  activeWorkloadSearchTextAtom,
} from "@/domain/workload/state/workload.atom";
import { isWorkspaceOwnerRole } from "@/domain/workspace/constants/workspace.constant";
import { MySearchFilter } from "@/shared/components/layouts/search-filter";
import { MyItemsOnlySwitch } from "@/shared/components/switch/my-items-only-switch";
import { SELECTOR } from "@/shared/constants/selector.constant";
import { selectedWorkspaceAtom } from "@/shared/state/core.atom";
import { getSessionAccountId } from "@/shared/utils/auth.util";

interface ActiveWorkloadListFilterProps {
  total: number;
  loading: boolean;
}

/**
 * 활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 *
 * 활성화 워크로드 목록 페이지에서 검색어, 작업 유형 및 상태를 필터링하는 기능을 제공합니다.
 *
 * @param total - 전체 워크로드 수
 * @param loading - 로딩 상태
 * @returns 활성화 워크로드 목록 페이지 상단 필터 컴포넌트
 */
export function ActiveWorkloadListFilter({
  total,
  loading,
}: ActiveWorkloadListFilterProps) {
  const { data: session } = useSession();
  const selectedWorkspace = useAtomValue(selectedWorkspaceAtom);
  const workspaceId = selectedWorkspace?.workspaceId;
  const accountId = getSessionAccountId(session);

  const { data: memberRole } = useGetWorkspaceMemberRole(
    workspaceId ?? 0,
    accountId ?? "",
    {
      query: {
        enabled: Boolean(workspaceId) && Boolean(accountId),
      },
    },
  );

  const canShowMyItemsSwitch = isWorkspaceOwnerRole(memberRole?.memberRole);

  const searchTextAtomValue = useAtomValue(activeWorkloadSearchTextAtom);
  const [localSearchText, setLocalSearchText] = useState(searchTextAtomValue);
  const setSearchText = useSetAtom(activeWorkloadSearchTextAtom);
  const resetPage = useResetAtom(activeWorkloadPageAtom);
  const [isMine, setIsMine] = useAtom(activeWorkloadIsMineAtom);

  useEffect(() => {
    setLocalSearchText(searchTextAtomValue);
  }, [searchTextAtomValue]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocalSearchText(event.target.value);
  };

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
      <ActiveWorkloadJobTypeSort disabled={loading} />
      <ActiveWorkloadStatusSort disabled={loading} />
      <Input.Search
        name="search"
        placeholder="검색어를 입력하세요."
        value={localSearchText}
        onChange={handleSearchChange}
        onSearch={handleSearch}
        autoComplete="off"
        width={220}
        height={30}
        disabled={loading}
        data-testid={SELECTOR.LIST_SEARCH_INPUT}
      />
    </MySearchFilter>
  );
}
