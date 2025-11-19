import type { DropdownOption } from "xiilab-ui";

import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const WORKLOAD_JOB_OPTIONS: DropdownOption[] = [
  {
    label: "Batch",
    value: "BATCH",
  },
  {
    label: "Interactive",
    value: "INTERACTIVE",
  },
  {
    label: "Distributed",
    value: "DISTRIBUTED",
  },
];

export const WORKLOAD_STATUS_OPTIONS: DropdownOption[] = [
  {
    label: "실행중",
    value: "RUNNING",
  },
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "에러",
    value: "ERROR",
  },
  {
    label: "종료",
    value: "COMPLETED",
  },
];

export const WORKLOAD_GUIDES: CoreGuide[] = [
  {
    icon: "Workload",
    title: "워크로드란?",
    description: [
      "워크로드란 워크스페이스에서 이뤄지는 잡(Job) 입니다.",
      "입력한 정보를 바탕으로 학습이 진행되도록 합니다.",
    ],
  },
  {
    icon: "Workspace01",
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
];

export const WORKLOAD_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/create-workload-guide1.png",
    alt: "워크로드 가이드 1",
  },
  {
    id: "2",
    src: "/images/create-workload-guide2.png",
    alt: "워크로드 가이드 2",
  },
  {
    id: "3",
    src: "/images/create-workload-guide3.png",
    alt: "워크로드 가이드 3",
  },
];
