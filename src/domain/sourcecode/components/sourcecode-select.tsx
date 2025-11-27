"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import { useGetSourcecodeOptions } from "@/domain/sourcecode/hooks/use-get-sourcecode-options";
import type {
  SourcecodeIdType,
  SourcecodeListType,
} from "../schemas/sourcecode.schema";

interface SourcecodeSelectProps {
  value: SourcecodeListType | null;
  setValue: Dispatch<SetStateAction<SourcecodeListType | null>>;
}

export function SourcecodeSelect({ value, setValue }: SourcecodeSelectProps) {
  const { data } = useGetSourcecodeOptions();

  const handleChange = (next: SourcecodeIdType | null) => {
    const selectedOption = data?.find((v) => v.origin.id === next);

    if (selectedOption) {
      setValue(selectedOption.origin);
    }
  };

  return (
    <Dropdown
      placeholder="소스코드를 선택해 주세요."
      options={data || []}
      value={value?.id || null}
      onChange={handleChange}
      width="100%"
    />
  );
}
