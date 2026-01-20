export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectWithAllProps {
  /** 접근성용 식별자 */
  id?: string;
  /** 선택 가능한 옵션 목록 */
  options: MultiSelectOption[];
  /** 선택된 값 배열 */
  value: string[];
  /** 선택 변경 핸들러 */
  onChange: (selectedValues: string[]) => void;
  /** 전체 선택 체크박스 라벨 (기본: "전체") */
  allLabel?: string;
  /** 드롭다운 너비 */
  width?: number;
  /** 드롭다운 높이 */
  height?: number;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}
