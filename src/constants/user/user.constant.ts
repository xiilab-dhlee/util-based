import type { CoreGuide, CoreGuideImage } from "@/types/common/core.model";

export const USER_GUIDE_IMAGES: CoreGuideImage[] = [
  {
    id: "1",
    src: "/images/user-guide1.png",
    alt: "사용자 가이드 1",
  },
  {
    id: "2",
    src: "/images/user-guide2.png",
    alt: "사용자 가이드 2",
  },
  {
    id: "3",
    src: "/images/user-guide3.png",
    alt: "사용자 가이드 3",
  },
];

export const USER_GUIDES: CoreGuide[] = [
  {
    icon: "SystemFilled",
    title: "그룹 관리란?",
    description: [
      "초기 가입 시 사용자가 선택한 그룹이 기본값으로 설정됩니다.",
      "관리자는 사용자 그룹 설정을 변경하여 사용자를 관리할 수 있습니다.",
    ],
  },
  {
    icon: "Delete",
    title: "그룹 삭제란?",
    description: [
      "관리자는 생성된 그룹을 생성, 수정, 삭제하여 관리할 수 있습니다.",
      "그룹 삭제시 포함된 사용자들은 '그룹 미지정 계정'으로 이동됩니다.",
    ],
  },
];
