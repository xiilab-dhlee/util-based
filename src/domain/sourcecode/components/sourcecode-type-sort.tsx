import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { SOURCECODE_TYPE_OPTIONS } from "@/domain/sourcecode/constants/sourcecode.constant";
import { sourcecodeTypeAtom } from "@/domain/sourcecode/state/sourcecode.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

/**
 * 소스코드 타입별 정렬 컴포넌트
 *
 * 소스코드 목록에서 타입(GitHub, GitLab, Bitbucket)을 선택하여
 * 해당 타입의 소스코드만 필터링할 수 있는 드롭다운 선택기를 제공합니다.
 *
 * @returns 소스코드 타입 선택 드롭다운 컴포넌트
 */
export function SourcecodeTypeSort() {
  const [codeType, setCodeType] = useAtom(sourcecodeTypeAtom);

  /**
   * 타입 선택 변경 핸들러
   *
   * @param value - 선택된 타입 값 (string | null)
   */
  const handleChange = (value: string | null) => {
    setCodeType(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...SOURCECODE_TYPE_OPTIONS]}
      placeholder="타입"
      onChange={handleChange}
      value={codeType}
      width={120}
      height={30}
    />
  );
}
