import { CompoundDropdown } from "xiilab-ui";

import type { GpuProfileListType } from "@/shared/schemas/gpu.schema";
import { MigProfileDropdownOption } from "./mig-profile-dropdown-option";

interface MigProfileSelectDropdownProps {
  profiles: GpuProfileListType[];
  value: GpuProfileListType["id"] | undefined;
  onChange: (value: GpuProfileListType["id"]) => void;
  error?: boolean;
  loading?: boolean;
}

export function MigProfileSelectDropdown({
  profiles,
  value,
  onChange,
  error,
  loading,
}: MigProfileSelectDropdownProps) {
  return (
    <CompoundDropdown
      theme="light"
      width="100%"
      height={40}
      placeholder="MIG 선택해 주세요."
      value={value}
      onChange={(value) => onChange(value as GpuProfileListType["id"])}
      status={error ? "error" : undefined}
      loading={loading}
    >
      {profiles.map((profile) => (
        <CompoundDropdown.Option
          key={profile.id}
          value={profile.id}
          display={profile.name}
        >
          <MigProfileDropdownOption profile={profile} />
        </CompoundDropdown.Option>
      ))}
    </CompoundDropdown>
  );
}
