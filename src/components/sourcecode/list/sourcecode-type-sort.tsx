import { useAtom } from "jotai";

import { sourcecodeTypeAtom } from "@/atoms/sourcecode.atom";
import { MySelect } from "@/components/common/select";
import { SOURCECODE_TYPE_OPTIONS } from "@/constants/sourcecode/sourcecode.constant";

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
    if (value) {
      setCodeType(value);
    }
  };

  return (
    <MySelect
      options={SOURCECODE_TYPE_OPTIONS}
      placeholder="타입"
      setValue={handleChange}
      value={codeType}
      width={120}
      height={30}
      isAll
    />
  );
}
