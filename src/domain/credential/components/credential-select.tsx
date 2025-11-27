"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import { useGetCredentialOptions } from "../hooks/use-get-credential-options";
import type { CredentialIdType } from "../schemas/credential.schema";

interface CredentialSelectProps {
  value: CredentialIdType | null;
  setValue: Dispatch<SetStateAction<CredentialIdType | null>>;
}

export function CredentialSelect({ value, setValue }: CredentialSelectProps) {
  const { data } = useGetCredentialOptions();

  return (
    <Dropdown
      placeholder="크레덴셜을 선택해 주세요."
      options={data || []}
      value={value}
      onChange={(value) => setValue(value)}
      width="100%"
    />
  );
}
