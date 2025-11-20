import type { CoreSecurityLevel } from "@/shared/types/core.interface";

const RESOURCE_MAP: Record<CoreSecurityLevel, Record<string, string>> = {
  ALL: {
    text: "전체",
    engText: "전체",
    icon: "Entire",
    iconColor: "#814DFF",
  },
  CRITICAL: {
    text: "심각",
    engText: "Critical",
    icon: "Critical",
    iconColor: "#FF2C2C",
    className: "red",
  },
  HIGH: {
    text: "높음",
    engText: "High",
    icon: "High",
    iconColor: "#FFA927",
    className: "orange",
  },
  MEDIUM: {
    text: "중간",
    engText: "Medium",
    icon: "Medium",
    iconColor: "#3C82FF",
    className: "blue",
  },
  LOW: {
    text: "낮음",
    engText: "Low",
    icon: "Low",
    iconColor: "#2DC598",
    className: "green",
  },
} as const;

/**
 * 보안 레벨 정보 조회
 * @param level - 보안 레벨
 * @returns 보안 레벨 정보
 */
export function getSecurityLevelInfo(
  level: CoreSecurityLevel,
): Record<string, string> {
  return RESOURCE_MAP[level];
}
