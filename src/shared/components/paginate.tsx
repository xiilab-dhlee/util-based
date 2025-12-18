import { Pagination } from "xiilab-ui";

import { SELECTOR } from "@/shared/constants/selector.constant";

interface PaginatorProps {
  // 현재 페이지
  current: number;
  // 총 페이지 수
  total: number;
  // 페이지 당 아이템 수
  pageSize: number;
  // 페이지 변경 핸들러
  onChange: (page: number, pageSize: number) => void;
  // 테스트용 페이지 식별자 (예: "workload", "sourcecode")
  testIdPage?: string;
}
// 페이지네이션 컴포넌트
export const MyPagination = ({ testIdPage, ...props }: PaginatorProps) => {
  return (
    <Pagination
      data-testid={testIdPage ? SELECTOR.listPagination(testIdPage) : undefined}
      {...props}
    />
  );
};
