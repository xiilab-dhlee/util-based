"use client";

import { Button } from "xiilab-ui";

import { MySearchFilter } from "@/shared/components/layouts/search-filter";

interface SettingRequestResourceListFilterProps {
  totalSize?: number;
  onOpenCreate: () => void;
  canManageWorkspace?: boolean;
}

export function SettingRequestResourceListFilter({
  totalSize,
  onOpenCreate,
  canManageWorkspace = false,
}: SettingRequestResourceListFilterProps) {
  return (
    <MySearchFilter title="리소스 요청 목록" total={totalSize}>
      {canManageWorkspace && (
        <Button
          color="primary"
          icon="RequestResource"
          iconPosition="left"
          variant="gradient"
          width={120}
          height={30}
          onClick={onOpenCreate}
        >
          리소스 요청
        </Button>
      )}
    </MySearchFilter>
  );
}
