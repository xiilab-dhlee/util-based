import type { MySelectOption } from "@/components/common/select";
import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const REQUEST_IMAGE_STATUS_OPTIONS: MySelectOption[] = [
  {
    label: "대기중",
    value: "PENDING",
  },
  {
    label: "승인됨",
    value: "APPROVED",
  },
  {
    label: "거절됨",
    value: "REJECTED",
  },
  {
    label: "완료",
    value: "COMPLETED",
  },
];

export const REQUEST_IMAGE_GUIDES: CoreGuide[] = [
  {
    icon: "PrivateRegistry",
    title: "내부 레지스트리란?",
    description: [
      "조직 내부에서 사용하는 컨테이너 이미지를 저장하고 관리하는",
      "전용 저장소입니다. 인터넷 연결 없이 사용하실 수 있습니다.",
    ],
  },
  {
    icon: "Image",
    title: "이미지 사용 요청 목록이란?",
    description: [
      "사용할 이미지의 요청 목록을 보는 목록으로 이미지 사용 요청의",
      "승인, 반려와 승인 여부에 대해서 한눈에 확인할 수 있는 화면입니다.",
    ],
  },
];

export const REQUEST_IMAGE_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/request-image-guide1.png",
    alt: "이미지 요청 가이드 1",
  },
  {
    id: "2",
    src: "/images/request-image-guide2.png",
    alt: "이미지 요청 가이드 2",
  },
  {
    id: "3",
    src: "/images/request-image-guide3.png",
    alt: "이미지 요청 가이드 3",
  },
];
