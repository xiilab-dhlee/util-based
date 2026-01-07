"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import { useGetCredentialOptions } from "@/domain/credential/hooks/use-get-credential-options";
import type { CredentialIdType } from "@/domain/credential/schemas/credential.schema";

interface CredentialSelectProps {
  value: CredentialIdType | null;
  setValue: Dispatch<SetStateAction<CredentialIdType | null>>;
}

export function CredentialSelect({ value, setValue }: CredentialSelectProps) {
  const { data } = useGetCredentialOptions();

  const handleCredentialChange = (value: string | number) => {
    if (typeof value === "number") {
      setValue(value);
    }
  };

  return (
    <Dropdown
      placeholder="크레덴셜을 선택해 주세요."
      options={data || []}
      value={value}
      onChange={handleCredentialChange}
      width="100%"
    />
  );
}
