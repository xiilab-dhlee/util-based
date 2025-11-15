import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const PRIVATE_REGISTRY_IMAGE_GUIDES: CoreGuide[] = [
  {
    icon: "Image",
    title: "내부 레지스트리란?",
    description: [
      "조직 내부에서 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    icon: "Security",
    title: "컨테이너 이미지란?",
    description: [
      "애플리케이션 실행에 필요한 프로그램, 라이브러리, 설정 파일 등을",
      "하나로 묶은 실행 패키지입니다.",
    ],
  },
];

export const PRIVATE_REGISTRY_IMAGE_GUIDE_IMAGES: CoreGuideImage[] = [
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
