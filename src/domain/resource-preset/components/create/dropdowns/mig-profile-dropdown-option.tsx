import { Typography } from "xiilab-ui";

import type { GpuProfileListType } from "@/shared/schemas/gpu.schema";
import {
  DropdownInfoBox,
  DropdownInfoItem,
  DropdownInfoLabel,
  DropdownInfoValue,
  DropdownOptionContent,
} from "./dropdown-option.styled";

interface MigProfileDropdownOptionProps {
  profile: GpuProfileListType;
}

export function MigProfileDropdownOption({
  profile,
}: MigProfileDropdownOptionProps) {
  return (
    <DropdownOptionContent>
      <Typography.Text variant="body-2-4" data-interactive-text>
        {profile.name}
      </Typography.Text>
      <DropdownInfoBox>
        <DropdownInfoItem>
          <DropdownInfoLabel>전체</DropdownInfoLabel>
          <DropdownInfoValue>{profile.total}개</DropdownInfoValue>
        </DropdownInfoItem>
      </DropdownInfoBox>
    </DropdownOptionContent>
  );
}
