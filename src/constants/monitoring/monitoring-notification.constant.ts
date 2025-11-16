import type { MySelectOption } from "@/components/common/select";
import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const MONITORING_NOTIFICATION_PAGE_SIZE = 10;

export const MONITORING_NOTIFICATION_TYPE_OPTIONS: MySelectOption[] = [
  {
    label: "GPU",
    value: "GPU",
  },
  {
    label: "GPU 메모리",
    value: "GPU_MEMORY",
  },
  {
    label: "CPU",
    value: "CPU",
  },
  {
    label: "MEM",
    value: "MEM",
  },
];

export const MONITORING_NOTIFICATION_OPERATOR_OPTIONS: MySelectOption[] = [
  {
    label: ">",
    value: ">",
  },
  {
    label: ">=",
    value: ">=",
  },
  {
    label: "<=",
    value: "<=",
  },
  {
    label: "<",
    value: "<",
  },
];

export const MONITORING_NOTIFICATION_GUIDES: CoreGuide[] = [
  {
    icon: "Setting01",
    title: "알림 설정이란?",
    description: [
      "원하는 알림을 상단의 '알림 추가' 버튼으로 등록하세요.",
      "등록된 알림은 아래에서 설정 수정 및 삭제가 가능합니다.",
    ],
  },
  {
    icon: "Request",
    title: "알림 내역이란?",
    description: [
      "생성한 알림 설정을 통해 오는 알림 리스트를 보여주는 영역입니다.",
      "이름, 주소, 이름, 채널, 발생일시 등을 전달합니다.",
    ],
  },
];

export const MONITORING_NOTIFICATION_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/monitoring-notification-guide1.png",
    alt: "모니터링 알림 가이드 1",
  },
  {
    id: "2",
    src: "/images/monitoring-notification-guide2.png",
    alt: "모니터링 알림 가이드 2",
  },
  {
    id: "3",
    src: "/images/monitoring-notification-guide3.png",
    alt: "모니터링 알림 가이드 3",
  },
];
