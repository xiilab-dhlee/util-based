import type {
  GetPrivateRegistriesPayload,
  GetPrivateRegistryImagePayload,
  GetPrivateRegistryImagesPayload,
  GetPrivateRegistryImageTagsPayload,
  GetPrivateRegistryImageTagVulnerabilityListPayload,
} from "@/types/registry/registry.interface";

const registryKeys = {
  default: ["registry"],
  // 내부 레지스트리 목록
  privateRegistryList: (payload: GetPrivateRegistriesPayload) => [
    ...registryKeys.default,
    "private-registry-list",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 목록
  privateRegistryimageList: (payload: GetPrivateRegistryImagesPayload) => [
    ...registryKeys.default,
    "private-registry-image-list",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 내 이미지 상세
  privateRegistryImageDetail: (payload: GetPrivateRegistryImagePayload) => [
    ...registryKeys.default,
    "private-registry-image-detail",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 내 이미지 태그 목록
  privateRegistryImageTags: (payload: GetPrivateRegistryImageTagsPayload) => [
    ...registryKeys.default,
    "private-registry-image-tags",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 내 이미지 태그 취약점 목록
  privateRegistryImageTagVulnerabilityList: (
    payload: GetPrivateRegistryImageTagVulnerabilityListPayload,
  ) => [
    ...registryKeys.default,
    "private-registry-image-tag-vulnerability-list",
    ...Object.values(payload),
  ],
};

export default registryKeys;
