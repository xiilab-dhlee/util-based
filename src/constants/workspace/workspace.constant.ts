import type { MySelectOption } from "@/components/common/select";
import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const WORKSPACE_SORT_OPTIONS: MySelectOption[] = [
  { value: "CREATED_AT_DESC", label: "생성일순" },
  { value: "MEM_ASSIGN_DESC", label: "Memory 할당순" },
  { value: "MEM_USE_DESC", label: "Memory 사용량순" },
  { value: "GPU_ASSIGN_DESC", label: "GPU 할당순" },
  { value: "GPU_USE_DESC", label: "GPU 사용량순" },
  { value: "CPU_ASSIGN_DESC", label: "CPU 할당순" },
  { value: "CPU_USE_DESC", label: "CPU 사용량순" },
  { value: "CREATOR_DESC", label: "사용자 이름순" },
  { value: "WORKSPACE_NAME_DESC", label: "워크스페이스 이름순" },
];

export const WORKSPACE_GUIDES: CoreGuide[] = [
  {
    icon: "Workspace01",
    title: "워크스페이스란?",
    description: [
      "워크스페이스란 팀별로 함께 사용하는 작업공간입니다.",
      "팀원이 생성한 워크로드 및 진행상황 확인이 가능합니다.",
    ],
  },
  // {
  //   iconName: "Resource",
  //   title: "워크스페이스 목록이란?",
  //   description: [
  //     "워크스페이스 목록은 팀별 작업공간을 관리하는 페이지입니다.",
  //     "각 워크스페이스의 자원 사용률과 생성자 · 생성일 정보를 한눈에",
  //     "확인할 수 있습니다.",
  //   ],
  // },
];

export const WORKSPACE_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/create-workspace-guide1.png",
    alt: "워크스페이스 가이드 1",
  },
  {
    id: "2",
    src: "/images/create-workspace-guide2.png",
    alt: "워크스페이스 가이드 2",
  },
  {
    id: "3",
    src: "/images/create-workspace-guide3.png",
    alt: "워크스페이스 가이드 3",
  },
];
