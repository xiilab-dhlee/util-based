import type { MigResourceType } from "@/domain/system-setting/schemas/workspace-resource-setting.schema";

/**
 * MIG 리소스 목록에서 특정 프로필이 중복되는지 확인
 *
 * @param resources - MIG 리소스 목록
 * @param profile - 확인할 MIG 프로필
 * @param ignoreIndex - 해당 인덱스는 중복 검사에서 제외 (수정 행 등)
 * @returns 중복 존재 여부
 */
export const hasDuplicateMigProfile = (
  resources: MigResourceType[], // 임시 타입
  profile: string,
  ignoreIndex?: number,
): boolean => {
  return resources.some((item, index) => {
    if (ignoreIndex !== undefined && index === ignoreIndex) {
      return false;
    }

    return item.profile === profile;
  });
};
