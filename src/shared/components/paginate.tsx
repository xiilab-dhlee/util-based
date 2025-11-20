import { Pagination } from "xiilab-ui";

interface PaginatorProps {
  // 현재 페이지
  current: number;
  // 총 페이지 수
  total: number;
  // 페이지 당 아이템 수
  pageSize: number;
  // 페이지 변경 핸들러
  onChange: (page: number, pageSize: number) => void;
}
// 페이지네이션 컴포넌트
export const MyPagination = (props: PaginatorProps) => {
  return <Pagination {...props} />;
};
