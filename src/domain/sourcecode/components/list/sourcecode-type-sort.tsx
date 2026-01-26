"use client";

import { useAtom } from "jotai";
import { useResetAtom } from "jotai/utils";
import { Dropdown } from "xiilab-ui";

import type { GetSourceCodeListCodeType } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { SOURCECODE_TYPE_OPTIONS } from "@/domain/sourcecode/constants/sourcecode.constant";
import {
  sourcecodeCheckedListAtom,
  sourcecodePageAtom,
  sourcecodeTypeSortAtom,
} from "@/domain/sourcecode/state/sourcecode.atom";
import { ALL_OPTION } from "@/shared/constants/core.constant";

interface SourcecodeTypeSortProps {
  disabled?: boolean;
}

export function SourcecodeTypeSort({ disabled }: SourcecodeTypeSortProps) {
  const [codeType, setCodeType] = useAtom(sourcecodeTypeSortAtom);
  const resetPage = useResetAtom(sourcecodePageAtom);
  const resetCheckedList = useResetAtom(sourcecodeCheckedListAtom);

  const handleChange = (value: GetSourceCodeListCodeType | null) => {
    resetPage();
    resetCheckedList();
    setCodeType(value);
  };

  return (
    <Dropdown
      options={[ALL_OPTION, ...SOURCECODE_TYPE_OPTIONS]}
      placeholder="소스코드 타입"
      onChange={handleChange}
      value={codeType}
      width={120}
      height={30}
      disabled={disabled}
    />
  );
}
