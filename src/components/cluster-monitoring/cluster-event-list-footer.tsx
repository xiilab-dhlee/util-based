"use client";

import { ListPageFooter } from "@/layouts/list/list-page-footer";

export function ClusterEventListFooter() {
  return (
    <ListPageFooter
      total={100}
      page={1}
      pageSize={12}
      onChange={() => {}}
      isLoading={false}
    />
  );
}
