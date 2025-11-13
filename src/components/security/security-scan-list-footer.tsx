"use client";

import registrySecurityConstants from "@/constants/security/registry-security.constant";
import { ListPageFooter } from "@/layouts/list/list-page-footer";

export function SecurityScanListFooter() {
  return (
    <ListPageFooter
      total={100}
      page={1}
      pageSize={registrySecurityConstants.scanResultPageSize}
      onChange={() => {}}
      isLoading={false}
    />
  );
}

