import {
  type UserResourceSchemaType,
  userResourceSchema,
} from "@/domain/monitoring/schemas/user-resource.schema";
import { LIST_PAGE_SIZE } from "@/shared/constants/core.constant";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 사용자별 리소스 점유율 mock 데이터
 */
export const userResourceListMock: UserResourceSchemaType[] = Array.from(
  { length: LIST_PAGE_SIZE },
  () => makeMock(userResourceSchema),
);

/**
 * 사용자별 리소스 점유율 mock 데이터 생성 팩토리
 */
export function createUserResourceListMock(
  override?: Partial<UserResourceSchemaType> & { size?: number },
): UserResourceSchemaType[] {
  const { size = LIST_PAGE_SIZE, ...restOverride } = override ?? {};
  return Array.from({ length: size }, () =>
    makeMock(userResourceSchema, restOverride),
  );
}
