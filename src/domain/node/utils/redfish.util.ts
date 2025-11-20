const HEALTH_STATUS_MAP: Record<string, Record<string, string>> = {
  Warning: {
    color: "orange",
  },
  Critical: {
    color: "red",
  },
  Disabled: {
    color: "black",
  },
  OK: {
    color: "green",
  },
} as const;

/**
 * Health 상태 정보 조회
 * @param status - Health 상태
 * @returns 상태 정보 (색상)
 */
export function getHealthStatusInfo(status: string): Record<string, string> {
  return HEALTH_STATUS_MAP[status];
}

/**
 * Redfish System ID 조회
 * @param system - Redfish 시스템 객체
 * @returns 시스템 ID
 */
export function getRedfishSystemId(system: Record<string, unknown>): string {
  if ("@odata.id" in system) {
    const odataId = system["@odata.id"];
    if (typeof odataId === "string") {
      return odataId.split("/").pop() || "";
    }
  }
  return "";
}
