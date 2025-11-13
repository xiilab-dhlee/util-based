import type { MySelectOption } from "@/components/common/select";
import type { PageGuideItemType } from "@/layouts/common/page-guide";

const GUIDE_IMAGES = [
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

const GUIDES: PageGuideItemType[] = [
  {
    iconName: "Setting01",
    title: "알림 설정이란?",
    description: [
      "원하는 알림을 상단의 '알림 추가' 버튼으로 등록하세요.",
      "등록된 알림은 아래에서 설정 수정 및 삭제가 가능합니다.",
    ],
  },
  {
    iconName: "Request",
    title: "알림 내역이란?",
    description: [
      "생성한 알림 설정을 통해 오는 알림 리스트를 보여주는 영역입니다.",
      "이름, 주소, 이름, 채널, 발생일시 등을 전달합니다.",
    ],
  },
];

const TYPE: MySelectOption[] = [
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

const OPERATOR: MySelectOption[] = [
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

const monitoringNotificationConstants = {
  // 페이지 크기
  pageSize: 10,
  // 가이드 이미지
  guideImages: GUIDE_IMAGES,
  // 가이드 항목들
  guides: GUIDES,
  // 타입
  type: TYPE,
  // 연산자
  operator: OPERATOR,
};

export default monitoringNotificationConstants;
