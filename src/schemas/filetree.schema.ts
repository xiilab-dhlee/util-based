import { z } from "zod";

// 파일 트리 스키마 (재귀적 구조)
const baseFileTreeSchema: z.ZodType<{
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  fileExtension: string | null;
  fileSize?: string;
  fileCount?: number;
  children: any[];
}> = z.lazy(() =>
  z.object({
    /** 파일/디렉토리 고유 ID */
    id: z.string(),
    /** 파일/디렉토리 이름 */
    name: z.string(),
    /** 파일 경로 */
    path: z.string(),
    /** 파일 타입 */
    type: z.enum(["file", "directory"]),
    /** 파일 확장자 (파일인 경우) */
    fileExtension: z.string().nullable(),
    /** 파일 크기 (파일인 경우) */
    fileSize: z.string().optional(),
    /** 폴더 내 파일 개수 (디렉토리인 경우) */
    fileCount: z.number().int().min(0).max(100).optional(),
    /** 자식 파일/디렉토리 목록 */
    children: z.array(baseFileTreeSchema),
  }),
);

export const fileTreeSchema = baseFileTreeSchema;
export const fileTreeArraySchema = z.array(fileTreeSchema);

// 타입 추출
export type FileTreeType = z.infer<typeof fileTreeSchema>;
export type FileTreeArrayType = z.infer<typeof fileTreeArraySchema>;
