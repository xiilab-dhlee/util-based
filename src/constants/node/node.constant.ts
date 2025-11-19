import type { DropdownOption } from "xiilab-ui";

import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const NODE_SORT_OPTIONS: DropdownOption[] = [
  { value: "CREATED_AT_DESC", label: "생성일순" },
  { value: "CPU_USAGE_DESC", label: "CPU 사용량순" },
  { value: "MEMORY_USAGE_DESC", label: "Memory 사용량순" },
  { value: "GPU_USAGE_DESC", label: "GPU 사용량순" },
  { value: "STORAGE_USAGE_DESC", label: "Storage 사용량순" },
  { value: "NODE_NAME_DESC", label: "노드 이름순" },
  { value: "STATUS_DESC", label: "상태순" },
  { value: "NODE_TYPE_DESC", label: "노드 타입순" },
];

export const NODE_GUIDES: CoreGuide[] = [
  {
    icon: "mps",
    title: "MPS",
    description: [
      "GPU를 MPS 방식으로 분할 설정하여,동일 GPU 자원을",
      "다수 작업에서 효율적으로 활용하도록 구성합니다.",
    ],
  },
  {
    icon: "mig",
    title: "MIG",
    description: [
      "GPU를 MIG방식으로 분할 설정하여, 하나의 GPU 자원을",
      "여러 작업에 효율적으로 분배하고 병렬 처리가능",
    ],
  },
];

export const NODE_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/node-guide1.png",
    alt: "노드 가이드 1",
  },
  {
    id: "2",
    src: "/images/node-guide2.png",
    alt: "노드 가이드 2",
  },
  {
    id: "3",
    src: "/images/node-guide3.png",
    alt: "노드 가이드 3",
  },
];
