import type {
  GetAdminInternalRegistryImagePayload,
  GetAdminInternalRegistryImagesPayload,
  GetInternalRegistryImagesPayload,
  GetInternalRegistryImageTagDetailPayload,
  GetInternalRegistryImageTagsPayload,
  GetInternalRegistryImageVulnerabilityListPayload,
} from "@/domain/internal-registry-image/types/internal-registry-image.type";
import type { InternalRegistryImageIdType } from "../schemas/internal-registry-image.schema";

export const internalregistryImageKeys = {
  default: ["internal-registry-image"],
  // 내부 레지스트리 이미지 목록
  list: (payload: GetInternalRegistryImagesPayload) => [
    ...internalregistryImageKeys.default,
    "list",
    ...Object.values(payload),
  ],
  allList: () => [...internalregistryImageKeys.default, "allList"],
  // 내부 레지스트리 내 이미지 상세
  detail: (imageId: InternalRegistryImageIdType) => [
    ...internalregistryImageKeys.default,
    "detail",
    imageId,
  ],
  // 관리자 내부 레지스트리의 이미지 목록
  adminList: (payload: GetAdminInternalRegistryImagesPayload) => [
    ...internalregistryImageKeys.default,
    "adminList",
    ...Object.values(payload),
  ],
  // 관리자 내부 레지스트리의 이미지 상세
  adminDetail: (payload: GetAdminInternalRegistryImagePayload) => [
    ...internalregistryImageKeys.default,
    "adminDetail",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 태그 목록
  tagList: (payload: GetInternalRegistryImageTagsPayload) => [
    ...internalregistryImageKeys.default,
    "tagList",
    ...Object.values(payload),
  ],
  allTagList: (imageId: InternalRegistryImageIdType) => [
    ...internalregistryImageKeys.default,
    "allTagList",
    imageId,
  ],
  // 내부 레지스트리 이미지 태그 상세
  tagDetail: (payload: GetInternalRegistryImageTagDetailPayload) => [
    ...internalregistryImageKeys.default,
    "tagDetail",
    ...Object.values(payload),
  ],
  // 관리자 내부 레지스스트리 이미지 태그 목록
  adminTagList: (payload: GetInternalRegistryImageTagsPayload) => [
    ...internalregistryImageKeys.default,
    "adminTagList",
    ...Object.values(payload),
  ],
  // 내부 레지스트리 이미지 태그 취약점 목록
  tagVulnerabilityList: (
    payload: GetInternalRegistryImageVulnerabilityListPayload,
  ) => [
    ...internalregistryImageKeys.default,
    "tagVulnerabilityList",
    ...Object.values(payload),
  ],
};
