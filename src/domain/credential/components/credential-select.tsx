"use client";

import type { Dispatch, SetStateAction } from "react";
import { Dropdown } from "xiilab-ui";

import { useGetCredentialOptions } from "@/domain/credential/hooks/use-get-credential-options";
import type { CredentialIdType } from "@/domain/credential/schemas/credential.schema";
import { CREDENTIAL_SELECTOR } from "@/shared/constants/selector.constant";

interface CredentialSelectProps {
  value: CredentialIdType | null;
  setValue: Dispatch<SetStateAction<CredentialIdType | null>>;
}

export function CredentialSelect({ value, setValue }: CredentialSelectProps) {
  const { data } = useGetCredentialOptions();

  return (
    <div data-testid={CREDENTIAL_SELECTOR.SELECT_WRAPPER}>
      <Dropdown
        placeholder="크리덴셜을 선택해 주세요."
        options={data || []}
        value={value}
        onChange={(value) => setValue(value)}
        width="100%"
      />
    </div>
  );
}
