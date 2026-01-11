import { ListPageFooter } from "@/shared/components/layouts/list-page-footer";

interface SettingMemberListFooterProps {
  total: number;
  page: number;
  pageSize: number;
  isLoading: boolean;
  onChangePage: (page: number) => void;
}

export function SettingMemberListFooter({
  total,
  page,
  pageSize,
  isLoading,
  onChangePage,
}: SettingMemberListFooterProps) {
  return (
    <ListPageFooter
      total={total}
      page={page}
      pageSize={pageSize}
      onChange={onChangePage}
      isLoading={isLoading}
    />
  );
}
