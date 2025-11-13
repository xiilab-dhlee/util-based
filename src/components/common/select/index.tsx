import type { CompoundDropdownProps } from "xiilab-ui";
import { CompoundDropdown } from "xiilab-ui";

import { Core } from "@/models/core.model";

export type MySelectOption = {
  label: string;
  value: string;
};

interface MySelectProps
  extends Omit<CompoundDropdownProps, "children" | "value"> {
  options: MySelectOption[];
  setValue: (value: string | null) => void;
  value: string | null;
  isAll?: boolean;
}

export function MySelect({
  options,
  setValue,
  value,
  isAll,
  ...props
}: MySelectProps) {
  const handleChange: CompoundDropdownProps["onChange"] = (option) => {
    setValue(option as string);
  };

  return (
    <CompoundDropdown
      onChange={handleChange}
      value={value || undefined}
      {...props}
    >
      {/* 전체 선택 옵션 */}
      {isAll && (
        <CompoundDropdown.Option value={Core.ALL_VALUE}>
          전체
        </CompoundDropdown.Option>
      )}
      {/* 옵션 목록 */}
      {options.map((option) => (
        <CompoundDropdown.Option key={option.value} value={option.value}>
          {/* data-interactive-text 속성으로 접근성 향상 */}
          <span data-interactive-text>{option.label}</span>
        </CompoundDropdown.Option>
      ))}
    </CompoundDropdown>
  );
}
