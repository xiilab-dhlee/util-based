import { Typography } from "xiilab-ui";

import type { GpuNodeListType } from "@/shared/schemas/gpu.schema";
import { getResourceInfo } from "@/shared/utils/resource.util";
import {
  DropdownInfoBox,
  DropdownInfoDivider,
  DropdownInfoItem,
  DropdownInfoLabel,
  DropdownInfoValue,
  DropdownOptionContent,
} from "./dropdown-option.styled";

interface NodeDropdownOptionProps {
  node: GpuNodeListType;
}

export function NodeDropdownOption({ node }: NodeDropdownOptionProps) {
  const gpuInfo = getResourceInfo("GPU");
  const cpuInfo = getResourceInfo("CPU");
  const memInfo = getResourceInfo("MEM");

  return (
    <DropdownOptionContent>
      <Typography.Text variant="body-2-4" color="#000" data-interactive-text>
        {node.name}
      </Typography.Text>
      <DropdownInfoBox>
        <DropdownInfoItem>
          <DropdownInfoLabel>{gpuInfo.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.gpuTotal}
            {gpuInfo.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
        <DropdownInfoDivider />
        <DropdownInfoItem>
          <DropdownInfoLabel>{cpuInfo.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.cpuTotal}
            {cpuInfo.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
        <DropdownInfoDivider />
        <DropdownInfoItem>
          <DropdownInfoLabel>{memInfo.text}</DropdownInfoLabel>
          <DropdownInfoValue>
            {node.memoryTotal}
            {memInfo.unit}
          </DropdownInfoValue>
        </DropdownInfoItem>
      </DropdownInfoBox>
    </DropdownOptionContent>
  );
}
