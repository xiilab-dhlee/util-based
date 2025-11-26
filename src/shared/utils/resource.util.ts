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
