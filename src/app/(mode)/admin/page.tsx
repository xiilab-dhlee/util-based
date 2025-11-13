import { redirect } from "next/navigation";

/**
 * 관리자 메인 페이지
 *
 * Pages Router와 동일하게 관리자 대시보드로 리다이렉트합니다.
 */
export default function AdminMainPage() {
  redirect("/admin/monitoring");
}
