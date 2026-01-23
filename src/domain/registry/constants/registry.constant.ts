export const USER_REGISTRY_PAGE_SIZE = 10;

export const REGISTRY_QUICK_MENUS = [
  {
    title: "이미지 사용 요청 관리",
    description: "이미지 사용 요청 이력을 관리하세요.",
    icon: "ImageUsageRequest",
    iconSize: 32,
    href: "/admin/request-image",
  },
  {
    title: "개인 레지스트리",
    description: "사용자별 개인 레지스트리를 관리하세요.",
    icon: "PrivateRegistry",
    iconSize: 32,
    href: "/admin/private-registry",
  },
  {
    title: "공유 레지스트리",
    description: "사용자별 공유 레지스트리를 관리하세요.",
    icon: "PublicRegistry",
    iconSize: 32,
    href: "/admin/public-registry",
  },
];
