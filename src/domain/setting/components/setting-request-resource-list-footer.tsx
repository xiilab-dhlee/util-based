"use client";

import { useAtom } from "jotai";

import { RESOURCE_REQUEST_LIST_PAGE_SIZE } from "@/domain/setting/constants/setting.constant";
import { settingRequestResourcePageAtom } from "@/domain/setting/state/setting.atom";
import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface SettingRequestResourceListFooterProps {
  totalSize: number;
  isLoading: boolean;
}

export function SettingRequestResourceListFooter({
  totalSize,
  isLoading,
}: SettingRequestResourceListFooterProps) {
  const [page, setPage] = useAtom(settingRequestResourcePageAtom);

  const handleChangePage = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <ListPageFooter
      total={totalSize}
      page={page}
      pageSize={RESOURCE_REQUEST_LIST_PAGE_SIZE}
      onChange={handleChangePage}
      isLoading={isLoading}
    />
  );
}
