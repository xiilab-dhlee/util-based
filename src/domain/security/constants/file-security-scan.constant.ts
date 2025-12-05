import type {
  FileScanStatus,
  FileScanType,
} from "@/domain/security/schemas/file-security-scan.schema";

/**
 * 파일 시스템 보안 검사 유형 한글 라벨 상수
 *
 * - REGULAR: 정기
 * - INDIVIDUAL: 개별
 */
export const FILE_SCAN_TYPE_LABEL: Record<FileScanType, string> = {
  REGULAR: "정기",
  INDIVIDUAL: "개별",
};

/**
 * 파일 시스템 보안 검사 상태 메타 정보
 *
 * - COMPLETED: 완료
 * - IN_PROGRESS: 진행중
 * - FAILED: 실패
 */
export const FILE_SCAN_STATUS_META: Record<
  FileScanStatus,
  {
    label: string;
    variant: "blue" | "green" | "red";
  }
> = {
  COMPLETED: {
    label: "완료",
    variant: "blue",
  },
  IN_PROGRESS: {
    label: "진행중",
    variant: "green",
  },
  FAILED: {
    label: "실패",
    variant: "red",
  },
};
