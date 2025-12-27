export const REGISTRY_QUICK_MENUS = [
  {
    title: "이미지 사용 요청 관리",
    description: "이미지 사용 요청 이력을 관리하세요.",
    icon: "ImageUsageRequest",
    iconSize: 32,
    href: "/admin/request-image",
  },
  {
    title: "내부 레지스트리",
    description: "사용자별 내부 레지스트리를 관리하세요.",
    icon: "PrivateRegistry",
    iconSize: 32,
    href: "/admin/internal-registry",
  },
  // TODO: 외부 레지스트리 기능 추가 시 활성화
  // {
  //   title: "외부 레지스트리",
  //   description: "사용자별 외부 레지스트리를 관리하세요.",
  //   icon: "PublicRegistry",
  //   iconSize: 32,
  //   href: "/admin/external-registry",
  // },
];
