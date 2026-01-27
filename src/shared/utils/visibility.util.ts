export type VisibilityLabel = "공개" | "비공개" | "-";

interface VisibilityInfo {
  label: VisibilityLabel;
  isPublic: boolean | null;
  iconName: "Lock" | null;
}

/**
 * 공개 설정을 UI에 안전하게 표시하기 위한 공통 유틸.
 * - true  -> 공개
 * - false -> 비공개 (Lock 아이콘)
 * - null/undefined -> "-"
 */
export const getVisibilityInfo = (
  isPublic?: boolean | null,
): VisibilityInfo => {
  if (isPublic === true) {
    return { label: "공개", isPublic: true, iconName: null };
  }

  if (isPublic === false) {
    return { label: "비공개", isPublic: false, iconName: "Lock" };
  }

  return { label: "-", isPublic: null, iconName: null };
};

export const getVisibilityLabel = (
  isPublic?: boolean | null,
): VisibilityLabel => getVisibilityInfo(isPublic).label;
