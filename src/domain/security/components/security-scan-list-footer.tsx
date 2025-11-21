"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

export function SecurityScanListFooter() {
  return (
    <ListPageFooter
      total={100}
      page={1}
      pageSize={14}
      onChange={() => {}}
      isLoading={false}
    />
  );
}
