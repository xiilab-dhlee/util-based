import type { Vulnerability } from "@/types/security/security.model";

const VULNERABILITY_DEMO: Vulnerability[] = Array.from(
  { length: 20 },
  (_, index) => ({
    id: `vulnerability-${index + 1}`,
    cve: `CVE-2023-${index + 1}`,
    nvd: "9.8",
    package: "zlib",
    redhat: "9.8",
    severity: "CRITICAL",
    version: "1:1.2.13.dfsg-1",
    updatedVersion: "1:1.2.13.dfsg-1",
  }),
);

const securityConstants = {
  // 취약점 데이터
  vulnerabilityDemo: VULNERABILITY_DEMO,
};

export default securityConstants;
