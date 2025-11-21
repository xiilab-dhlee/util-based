"use client";

import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

export function ClusterResourceListFooter() {
  return (
    <ListPageFooter
      total={100}
      page={1}
      pageSize={15}
      onChange={() => {}}
      isLoading={false}
    />
  );
}
