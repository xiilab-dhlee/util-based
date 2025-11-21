import { z } from "zod";

// 내부 레지스트리 이미지 전체 스키마
const basePrivateRegistryImageSchema = z.object({
  /** 이미지 고유 ID */
  id: z.number(),
  /** 프로젝트 ID (레지스트리 ID) */
  projectId: z.number(),
  /** 이미지 이름 */
  name: z.string().min(1),
  /** 이미지 설명 */
  description: z.string().nullable(),
  /** 태그 개수 */
  tagCnt: z.number().int().min(0),
  /** Pull(다운로드) 횟수 */
  pullCnt: z.number().int().min(0),
  /** 생성 일시 */
  creatorDate: z.string().datetime(),
  /** 생성자 */
  creatorName: z.string(),
  /** 수정 일시 */
  updatedAt: z.string().datetime(),
  /** 업로드 상태 */
  status: z.enum(["RUNNING", "SUCCESSED"]),
});

// 내부 레지스트리 이미지 목록용 스키마
export const privateRegistryImageListSchema = basePrivateRegistryImageSchema;

// 내부 레지스트리 이미지 상세용 스키마
export const privateRegistryImageDetailSchema = basePrivateRegistryImageSchema;

// 타입 추출
type PrivateRegistryImage = z.infer<typeof basePrivateRegistryImageSchema>;
export type PrivateRegistryImageListType = z.infer<
  typeof privateRegistryImageListSchema
>;
export type PrivateRegistryImageIdType = PrivateRegistryImageListType["id"];
export type PrivateRegistryImageDetailType = z.infer<
  typeof privateRegistryImageDetailSchema
>;
export type PrivateRegistryImageStatusType = PrivateRegistryImage["status"];
