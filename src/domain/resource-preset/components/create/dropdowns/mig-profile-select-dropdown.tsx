import type { DropdownOption } from "xiilab-ui";
import { Dropdown } from "xiilab-ui";

interface MigProfileSelectDropdownProps {
  profiles: string[];
  value: string | undefined;
  onChange: (profileName: string) => void;
  isError?: boolean;
  isLoading?: boolean;
}

export function MigProfileSelectDropdown({
  profiles,
  value,
  onChange,
  isError,
  isLoading,
}: MigProfileSelectDropdownProps) {
  const options: DropdownOption[] = profiles.map((profile) => ({
    label: profile,
    value: profile,
  }));

  const handleChange = (nextValue: string | number | null) => {
    if (nextValue === null) return;
    onChange(String(nextValue));
  };

  return (
    <Dropdown
      placeholder={"MIG Profile을 선택해 주세요."}
      value={value ?? null}
      options={options}
      onChange={handleChange}
      loading={isLoading}
      disabled={isLoading}
      status={isError ? "error" : undefined}
      width="100%"
    />
  );
}
