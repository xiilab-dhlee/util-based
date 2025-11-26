import type { CoreResourceType } from "@/shared/types/core.interface";

const RESOURCE_MAP: Record<CoreResourceType, Record<string, string>> = {
  GPU: {
    text: "GPU",
    unit: "개",
    icon: "Gpu",
    color: "#A353FF",
  },
  MIG: {
    text: "MIG",
    unit: "개",
    icon: "mig",
    color: "#D77BFF",
  },
  MPS: {
    text: "MPS",
    unit: "개",
    icon: "mps",
    color: "#D77BFF",
  },
  CPU: {
    text: "CPU",
    unit: "Core",
    icon: "Cpu",
    color: "#376DFF",
  },
  MEM: {
    text: "Memory",
    unit: "GB",
    icon: "Mem",
    color: "#55D398",
  },
  DISK: {
    text: "Disk",
    unit: "GB",
    icon: "Disk",
    color: "#17CDE5",
  },
} as const;

type ByteUnit = "MB" | "GB" | "TB";

const BYTES_IN_KB = 1024;
const BYTES_IN_MB = BYTES_IN_KB * 1024;
const BYTES_IN_GB = BYTES_IN_MB * 1024;
const BYTES_IN_TB = BYTES_IN_GB * 1024;

export type ReturnTypeOfGetResourceInfo = ReturnType<typeof getResourceInfo>;

/**
 * 리소스 타입 정보 조회
 * @param resourceType - 리소스 타입
 * @returns 리소스 정보 (텍스트, 단위, 아이콘, 색상)
 */
export function getResourceInfo(
  resourceType: CoreResourceType,
): Record<string, string> {
  return RESOURCE_MAP[resourceType];
}

/**
 * 모든 리소스 상태에 따른 클래스명 조회
 * @param gpu - GPU 사용률
 * @param cpu - CPU 사용률
 * @param mem - 메모리 사용률
 * @returns 상태 클래스명 ("overflow" | "warning" | "")
 */
export function getAllStatusClassName(
  gpu: number,
  cpu: number,
  mem: number,
): string {
  if (gpu >= 90 || cpu >= 90 || mem >= 90) {
    return "overflow";
  }
  if (gpu >= 60 || cpu >= 60 || mem >= 60) {
    return "warning";
  }
  return "";
}

/**
 * 리소스 사용률에 따른 클래스명 조회
 * @param resourcePercent - 리소스 사용률
 * @returns 상태 클래스명 ("overflow" | "warning" | "")
 */
export function getStatusClassName(resourcePercent: number): string {
  if (resourcePercent >= 90) {
    return "overflow";
  }
  if (resourcePercent >= 60) {
    return "warning";
  }
  return "";
}

/**
 * bytes 값을 1024 기준으로 지정한 단위로 변환하고,
 * 변환된 숫자 값과 단위가 포함된 문자열을 함께 반환합니다.
 *
 * @example
 * convertBytes(1048576, "MB") // { value: 1, label: "1 MB" }
 * convertBytes(1073741824, "GB") // { value: 1, label: "1 GB" }
 */
export function convertBytes(
  bytes: number,
  unit: ByteUnit,
  decimals = 1,
): { value: number; label: string } {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return { value: 0, label: `0 ${unit}` };
  }

  const safeDecimals = decimals < 0 ? 0 : decimals;

  let divider = BYTES_IN_MB;

  if (unit === "GB") {
    divider = BYTES_IN_GB;
  } else if (unit === "TB") {
    divider = BYTES_IN_TB;
  }

  const rawValue = bytes / divider;
  const value =
    safeDecimals === 0
      ? Math.round(rawValue)
      : Number(rawValue.toFixed(safeDecimals));

  return {
    value,
    label: `${value} ${unit}`,
  };
}
