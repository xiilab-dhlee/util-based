import type { SecurityLevelKey } from "@/shared/constants/security.constant";
import {
  SECURITY_USAGE_DISABLED,
  type SecurityUsageStatus,
} from "@/shared/constants/security.constant";
import {
  VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL,
  VULNERABILITY_SEVERITY_RESOURCE_MAP,
} from "@/shared/constants/vulnerability.constant";

interface SecurityLevelDescriptionParams {
  usageStatus: SecurityUsageStatus;
  level: SecurityLevelKey;
  thresholdCount: number;
}

export function createSecurityLevelDescription(
  params: SecurityLevelDescriptionParams,
): string {
  const { usageStatus, level, thresholdCount } = params;

  if (usageStatus === SECURITY_USAGE_DISABLED) {
    return "-";
  }

  if (!Number.isFinite(thresholdCount) || thresholdCount <= 0) {
    return "-";
  }

  const coreLevel = VULNERABILITY_LEVEL_KEY_TO_CORE_LEVEL[level];
  const levelInfo = VULNERABILITY_SEVERITY_RESOURCE_MAP[coreLevel];
  const levelLabel = levelInfo.engText;

  return `${levelLabel} 이상의 취약점 ${thresholdCount}개 이상 발견시 사용 불가`;
}
