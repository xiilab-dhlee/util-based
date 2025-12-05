import type { ReactNode } from "react";
import { Label } from "xiilab-ui";

import { FILE_SCAN_STATUS_META } from "@/domain/security/constants/file-security-scan.constant";
import type { FileScanStatus } from "@/domain/security/schemas/file-security-scan.schema";

/**
 * 파일 시스템 보안 검사 상태 라벨 렌더링 유틸
 *
 * - 유효하지 않은 상태 또는 값이 없는 경우 기본 "-" 라벨을 반환합니다.
 */
export function renderFileScanStatusLabel(
  status?: FileScanStatus | null,
): ReactNode {
  if (!status) {
    return <Label variant="black">-</Label>;
  }

  const meta = FILE_SCAN_STATUS_META[status];

  if (!meta) {
    return <Label variant="black">-</Label>;
  }

  return <Label variant={meta.variant}>{meta.label}</Label>;
}
