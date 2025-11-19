import type { DropdownOption } from "xiilab-ui";

import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const REPORT_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/report-guide1.png",
    alt: "리포트 가이드 1",
  },
  {
    id: "2",
    src: "/images/report-guide2.png",
    alt: "리포트 가이드 2",
  },
  {
    id: "3",
    src: "/images/report-guide3.png",
    alt: "리포트 가이드 3",
  },
];

export const REPORT_DATE_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "주간",
    value: "WEEKLY",
  },
  {
    label: "월간",
    value: "MONTHLY",
  },
];

export const REPORT_TYPE_OPTIONS: DropdownOption[] = [
  {
    label: "시스템 리포트",
    value: "SYSTEM",
  },
  {
    label: "클러스터 리포트",
    value: "CLUSTER",
  },
];

export const REPORT_GUIDES: CoreGuide[] = [
  {
    icon: "Reportsolid",
    title: "리포트란?",
    description: [
      "자원 활용 현황, 통계 등의 정보를 모아 볼 수 있는 기능입니다.",
      "기간을 설정하고 리포트 생성 후 PDF 다운로드 가능합니다.",
    ],
  },
  {
    icon: "ReportReservationsolid",
    title: "리포트 예약이란?",
    description: [
      "리포트 생성 주기와 받는 사람을 지정하여 리포트를 생성하는",
      "기능입니다. 주기적으로 자원 효율 정도를 관리할 수 있습니다.",
    ],
  },
];
