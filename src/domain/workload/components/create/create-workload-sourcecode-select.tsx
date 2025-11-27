"use client";

import { useAtom } from "jotai";
import { Dropdown } from "xiilab-ui";

import { useGetSourcecodeOptions } from "@/domain/sourcecode/hooks/use-get-sourcecode-options";
import { useSelect } from "@/shared/hooks/use-select";
import { inputSourcecodeIdAtom } from "../../state/create-workload.atom";

export function CreateWorkloadSourcecodeSelect() {
  const [sourcecodeId, setSourcecodeId] = useAtom(inputSourcecodeIdAtom);

  /** 소스코드 옵션 목록 조회 */
  const { data } = useGetSourcecodeOptions();

  const sourcecode = useSelect(null, data || []);

  const handleChangeSourcecode = (value: string) => {
    setSourcecodeId(value);
  };

  return (
    <Dropdown
      placeholder="소스코드를 선택해 주세요."
      options={sourcecode.options}
      value={sourcecodeId}
      onChange={handleChangeSourcecode}
      width="100%"
    />
  );
}
