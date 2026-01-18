// 파일 업로드 상태
export type UploadFileStatus =
  | "pending"
  | "uploading"
  | "completed"
  | "error"
  | "cancelled";

// 파일 업로드 아이템
export interface UploadFileItem {
  id: string;
  name: string;
  size: number;
  status: UploadFileStatus;
  progress: number;
  error?: string;
}
