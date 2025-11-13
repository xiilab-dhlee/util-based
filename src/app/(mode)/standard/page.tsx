import { redirect } from "next/navigation";

/**
 * 표준 사용자 메인 페이지
 *
 * Pages Router와 동일하게 표준 사용자 대시보드로 리다이렉트합니다.
 */
export default function StandardMainPage() {
  redirect("/standard/dashboard");
}
