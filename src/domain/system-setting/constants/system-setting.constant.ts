/** 스토리지 설정 페이지 사이즈 (8개씩) */
export const STORAGE_SETTING_PAGE_SIZE = 8;

/** 스토리지 설정 로딩 스켈레톤 키 */
export const STORAGE_SETTING_SKELETON_KEYS = Array.from(
  { length: STORAGE_SETTING_PAGE_SIZE },
  (_, i) => `skeleton-${i}`,
);

/** 스토리지 타입 드롭다운 옵션 */
export const STORAGE_TYPE_OPTIONS = [{ label: "NFS", value: "NFS" }];

/** 기본 스토리지 타입 값 */
export const DEFAULT_STORAGE_TYPE = STORAGE_TYPE_OPTIONS[0].value;

/** Google SMTP 기본 설정 */
export const GOOGLE_SMTP_CONFIG = {
  nodeAddress: "smtp.gmail.com",
  nodePort: "587",
} as const;
