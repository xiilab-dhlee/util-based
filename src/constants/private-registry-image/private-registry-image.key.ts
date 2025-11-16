import type {
  GetAdminPrivateRegistryImagePayload,
  GetAdminPrivateRegistryImagesPayload,
  GetPrivateRegistryImagesPayload,
  GetPrivateRegistryImageTagDetailPayload,
  GetPrivateRegistryImageTagsPayload,
  GetPrivateRegistryImageVulnerabilityListPayload,
} from "@/types/private-registry-image/private-registry-image.type";

export const privateRegistryImageKeys = {
  default: ["private-registry-image"],
  // 내부 레지스트리 이미지 목록
  list: (payload: GetPrivateRegistryImagesPayload) => [
    ...privateRegistryImageKeys.default,
    "list",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 내 이미지 상세
  detail: (imageId: number) => [
    ...privateRegistryImageKeys.default,
    "detail",
    imageId,
  ],
  // 관리자 내부 레지스트리의 이미지 목록
  adminList: (payload: GetAdminPrivateRegistryImagesPayload) => [
    ...privateRegistryImageKeys.default,
    "adminList",
    ...Object.values(payload),
  ],
  // 관리자 내부 레지스트리의 이미지 상세
  adminDetail: (payload: GetAdminPrivateRegistryImagePayload) => [
    ...privateRegistryImageKeys.default,
    "adminDetail",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 태그 목록
  tagList: (payload: GetPrivateRegistryImageTagsPayload) => [
    ...privateRegistryImageKeys.default,
    "tagList",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 태그 상세
  tagDetail: (payload: GetPrivateRegistryImageTagDetailPayload) => [
    ...privateRegistryImageKeys.default,
    "tagDetail",
    ...Object.values(payload),
  ],
  // 관리자 내부 레지스스트리 이미지 태그 목록
  adminTagList: (payload: GetPrivateRegistryImageTagsPayload) => [
    ...privateRegistryImageKeys.default,
    "adminTagList",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 태그 취약점 목록
  tagVulnerabilityList: (
    payload: GetPrivateRegistryImageVulnerabilityListPayload,
  ) => [
    ...privateRegistryImageKeys.default,
    "tagVulnerabilityList",
    ...Object.values(payload),
  ],
};
