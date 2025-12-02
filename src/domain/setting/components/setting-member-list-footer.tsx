"use client";

import { useAtom, useAtomValue } from "jotai";

import { SETTING_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { useGetSettingWorkspaceMembers } from "@/domain/setting/hooks/use-get-setting-workspace-members";
import {
  settingMemberPageAtom,
  settingMemberSearchTextAtom,
} from "@/domain/setting/state/setting.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

export function SettingMemberListFooter() {
  // 페이지 번호
  const [page, setPage] = useAtom(settingMemberPageAtom);
  // 검색어
  const searchText = useAtomValue(settingMemberSearchTextAtom);

  // ✅ 반응형: 데이터 변경 시 자동으로 업데이트
  const { data, isLoading } = useGetSettingWorkspaceMembers({
    page,
    size: SETTING_LIST_PAGE_SIZE,
    searchText,
  });

  // 페이지 변경 핸들러
  const handlePage = (page: number) => {
    setPage(page);
  };

  return (
    <ListPageFooter
      total={data?.totalSize || 0}
      page={page}
      pageSize={SETTING_LIST_PAGE_SIZE}
      onChange={handlePage}
      isLoading={isLoading}
    />
  );
}
