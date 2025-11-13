import type { CoreSecurityLevel } from "@/types/common/core.interface";

// 보안 취약점
export type Vulnerability = {
  // 아이디
  id: string;
  // 취약점
  cve: string;
  // 보안 상태
  severity: CoreSecurityLevel;
  nvd: string;
  redhat: string;
  package: string;
  version: string;
  updatedVersion: string;
};
