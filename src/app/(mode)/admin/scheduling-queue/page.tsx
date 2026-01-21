import type { Metadata } from "next";

import { SchedulingQueueMain } from "@/domain/scheduling-queue/components/scheduling-queue-main";

/**
 * 스케쥴링 큐 관리 페이지 메타데이터
 */
export const metadata: Metadata = {
  title: "Scheduling Queue Management",
};

/**
 * 스케쥴링 큐 관리 페이지
 *
 * 대기중인 워크로드 목록과 긴급 대기열 목록을 관리하는 페이지입니다.
 */
export default function AdminSchedulingQueuePage() {
  return <SchedulingQueueMain />;
}
